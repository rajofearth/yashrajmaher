import { NextResponse } from 'next/server';
import { openrouter, selectOptimalModel, safeApiCall } from '@/lib/openrouter';
import { CHAT_TOOLS, toolFunctions } from '@/lib/chat-tools';
import { z } from 'zod';

// Validation schema
const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationHistory: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string()
  })).optional().default([])
});

// System prompt for the chat agent
const SYSTEM_PROMPT = `You are Yashraj Maher's website assistant. Help visitors explore his content efficiently.

**Core Instructions:**
- Use multiple tools simultaneously for comprehensive results
- Always search relevant content before responding
- Be direct and specific with findings
- Include titles, dates, and direct links from search results

**Multi-tool Strategy:**
- For broad queries: Use both blog and dev post searches
- For specific content: Search + retrieve full content if needed
- For comparisons: Search multiple categories simultaneously
- Always prioritize the most relevant and recent content

Respond with concrete findings, not general information.`;



// Handle tool calls
const handleToolCall = async (toolCall) => {
  const { name, arguments: args } = toolCall.function;
  
  try {
    const parsedArgs = JSON.parse(args);
    
    if (toolFunctions[name]) {
      const result = await toolFunctions[name](parsedArgs);
      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify(result)
      };
    } else {
      return {
        tool_call_id: toolCall.id,
        role: 'tool',
        content: JSON.stringify({
          success: false,
          message: `Unknown tool: ${name}`
        })
      };
    }
  } catch (error) {
    return {
      tool_call_id: toolCall.id,
      role: 'tool',
      content: JSON.stringify({
        success: false,
        message: `Error executing tool: ${error.message}`
      })
    };
  }
};

// Handle streaming response
const handleStreamingResponse = async (messages, modelConfig) => {
  const stream = await openrouter.chat.completions.create({
    ...modelConfig,
    messages,
    tools: CHAT_TOOLS,
    tool_choice: 'auto',
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        let toolCalls = [];
        let currentToolCall = null;
        
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta;
          
          if (delta?.content) {
            const data = `data: ${JSON.stringify({ 
              type: 'content', 
              content: delta.content 
            })}\n\n`;
            controller.enqueue(encoder.encode(data));
          }
          
          if (delta?.tool_calls) {
            for (const toolCall of delta.tool_calls) {
              if (toolCall.index !== undefined) {
                if (!toolCalls[toolCall.index]) {
                  toolCalls[toolCall.index] = {
                    id: toolCall.id || '',
                    type: 'function',
                    function: { name: '', arguments: '' }
                  };
                }
                
                if (toolCall.function?.name) {
                  toolCalls[toolCall.index].function.name += toolCall.function.name;
                }
                if (toolCall.function?.arguments) {
                  toolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
                }
              }
            }
          }
          
          if (chunk.choices[0]?.finish_reason === 'tool_calls') {
            // Handle tool calls
            const data = `data: ${JSON.stringify({ 
              type: 'tool_calls', 
              tool_calls: toolCalls 
            })}\n\n`;
            controller.enqueue(encoder.encode(data));
            
            // Execute tool calls
            for (const toolCall of toolCalls) {
              const toolResult = await handleToolCall(toolCall);
              const toolData = `data: ${JSON.stringify({ 
                type: 'tool_result', 
                result: toolResult 
              })}\n\n`;
              controller.enqueue(encoder.encode(toolData));
            }
            
            // Continue with tool results
            const updatedMessages = [
              ...messages,
              {
                role: 'assistant',
                content: null,
                tool_calls: toolCalls
              },
              ...toolCalls.map(toolCall => handleToolCall(toolCall))
            ];
            
            // Get final response
            const finalStream = await openrouter.chat.completions.create({
              ...modelConfig,
              messages: await Promise.all(updatedMessages),
              stream: true,
            });
            
            for await (const finalChunk of finalStream) {
              const finalDelta = finalChunk.choices[0]?.delta;
              if (finalDelta?.content) {
                const finalData = `data: ${JSON.stringify({ 
                  type: 'content', 
                  content: finalDelta.content 
                })}\n\n`;
                controller.enqueue(encoder.encode(finalData));
              }
            }
          }
        }
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`));
      } catch (error) {
        const errorData = `data: ${JSON.stringify({ 
          type: 'error', 
          error: error.message 
        })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};

// Handle non-streaming response
const handleRegularResponse = async (messages, modelConfig) => {
  let response = await safeApiCall(() => 
    openrouter.chat.completions.create({
      ...modelConfig,
      messages,
      tools: CHAT_TOOLS,
      tool_choice: 'auto',
    })
  );

  let finalResponse = response.choices[0].message;
  const toolCalls = finalResponse.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    // Handle tool calls
    const toolResults = await Promise.all(
      toolCalls.map(handleToolCall)
    );

    // Add assistant message with tool calls and tool results to conversation
    const updatedMessages = [
      ...messages,
      {
        role: 'assistant',
        content: finalResponse.content,
        tool_calls: toolCalls
      },
      ...toolResults
    ];

    // Get final response after tool execution
    response = await safeApiCall(() =>
      openrouter.chat.completions.create({
        ...modelConfig,
        messages: updatedMessages,
      })
    );

    finalResponse = response.choices[0].message;
  }

  return {
    message: finalResponse.content,
    usage: response.usage,
    model: response.model,
    toolCalls: toolCalls || [],
  };
};

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = chatRequestSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: validation.error.errors.map(e => e.message).join(', ') 
        },
        { status: 400 }
      );
    }

    const { message, conversationHistory } = validation.data;

    // Prepare messages for the API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Automatically select the optimal model configuration
    const modelConfig = selectOptimalModel(message);

    // Handle regular response
    const result = await handleRegularResponse(messages, modelConfig);
    return NextResponse.json({
      success: true,
      ...result
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'An error occurred while processing your request. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Chat API is running - Intelligent Model Selection',
    features: ['Smart Model Selection', 'Tool Calling', 'Content Search'],
    tools: CHAT_TOOLS.map(tool => ({
      name: tool.function.name,
      description: tool.function.description
    }))
  });
} 