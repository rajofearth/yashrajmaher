import { NextResponse } from 'next/server';
import { FREE_MODELS, MODEL_CONFIGS } from '@/lib/openrouter';
import { CHAT_TOOLS } from '@/lib/chat-tools';

export async function GET() {
  try {
    // Test basic configuration
    const apiKeyConfigured = !!process.env.OPENROUTER_API_KEY;
    const githubConfigured = !!(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO_OWNER && process.env.GITHUB_REPO_NAME);
    
    return NextResponse.json({
      success: true,
      message: 'Chat Agent Test Endpoint',
      configuration: {
        openrouterApiKey: apiKeyConfigured ? 'Configured ✅' : 'Missing ❌',
        githubCredentials: githubConfigured ? 'Configured ✅' : 'Missing ❌',
        freeModelsAvailable: Object.keys(FREE_MODELS).length,
        modelConfigs: Object.keys(MODEL_CONFIGS),
        toolsAvailable: CHAT_TOOLS.length,
      },
      availableModels: FREE_MODELS,
      tools: CHAT_TOOLS.map(tool => ({
        name: tool.function.name,
        description: tool.function.description
      })),
      recommendations: [
        !apiKeyConfigured && 'Add OPENROUTER_API_KEY to your .env file',
        !githubConfigured && 'Ensure GitHub credentials are configured for content search',
        'Test the chat by visiting /api/chat/test in your browser',
        'Use the chat bubble on your website to interact with the agent'
      ].filter(Boolean)
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Configuration test failed'
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { testType = 'basic' } = await request.json();
    
    if (testType === 'tools') {
      // Test tool availability
      const { toolFunctions } = await import('@/lib/chat-tools');
      const toolTests = await Promise.all(
        Object.keys(toolFunctions).map(async (toolName) => {
          try {
            // Test with minimal valid parameters
            let testParams = {};
            switch (toolName) {
              case 'search_blog_posts':
              case 'search_dev_posts':
                testParams = { query: 'test', limit: 1 };
                break;
              case 'get_post_content':
                testParams = { path: 'test/path' };
                break;
              case 'get_latest_posts':
                testParams = { type: 'both', limit: 1 };
                break;
              case 'get_author_info':
                testParams = {};
                break;
            }
            
            const result = await toolFunctions[toolName](testParams);
            return {
              tool: toolName,
              status: result.success ? 'Working ✅' : 'Error ❌',
              message: result.message || 'No message'
            };
          } catch (error) {
            return {
              tool: toolName,
              status: 'Error ❌',
              message: error.message
            };
          }
        })
      );
      
      return NextResponse.json({
        success: true,
        message: 'Tool connectivity test completed',
        toolTests
      });
    }
    
    if (testType === 'openrouter') {
      // Test OpenRouter connection
      const { openrouter, DEFAULT_MODEL } = await import('@/lib/openrouter');
      
      try {
        const response = await openrouter.chat.completions.create({
          model: DEFAULT_MODEL,
          messages: [
            { role: 'system', content: 'You are a test assistant.' },
            { role: 'user', content: 'Say "Hello, this is a test!" and nothing else.' }
          ],
          max_tokens: 50,
          temperature: 0
        });
        
        return NextResponse.json({
          success: true,
          message: 'OpenRouter connection test successful',
          testResponse: response.choices[0].message.content,
          model: response.model,
          usage: response.usage
        });
      } catch (error) {
        return NextResponse.json({
          success: false,
          message: 'OpenRouter connection test failed',
          error: error.message
        }, { status: 500 });
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Basic test completed',
      availableTests: ['basic', 'tools', 'openrouter']
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Test execution failed'
    }, { status: 500 });
  }
} 