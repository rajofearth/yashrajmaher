'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Loader2, Bot, User, Search, Code, Lightbulb, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm here to help you explore Yashraj's work. I can find blog posts, show you development projects, or answer questions about the content. What interests you?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          conversationHistory: messages.slice(1) // Exclude the initial greeting
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString(),
          model: data.model,
          toolCalls: data.toolCalls
        };

        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage = {
          role: 'assistant',
          content: `I'm sorry, there was an error: ${data.message}`,
          timestamp: new Date().toISOString(),
          isError: true
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Chat cleared! How can I help you today?",
        timestamp: new Date().toISOString()
      }
    ]);
  };



  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all duration-300 z-50 group"
        style={{ 
          boxShadow: 'var(--shadow-lg)',
          fontFamily: 'var(--font-sans)'
        }}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
        <span className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ fontFamily: 'var(--font-sans)' }}>
          Ask me anything!
        </span>
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-card rounded-lg border border-border z-50 flex flex-col"
      style={{ 
        boxShadow: 'var(--shadow-2xl)',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Bot size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
              Chat Assistant
            </h3>
            <p className="text-xs text-muted-foreground">
              Intelligent & helpful
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors duration-200 p-1 rounded-md hover:bg-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">


        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex space-x-2",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {message.role === 'assistant' && (
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <Bot size={12} className="text-primary-foreground" />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-md px-3 py-2",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : message.isError
                  ? 'bg-destructive/10 text-destructive border border-destructive/20'
                  : 'bg-muted text-foreground'
              )}
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</div>
              {message.toolCalls && message.toolCalls.length > 0 && (
                <div className="text-xs text-primary mt-2 flex items-center">
                  <Sparkles size={10} className="mr-1" />
                  Used {message.toolCalls.length} tool{message.toolCalls.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
            {message.role === 'user' && (
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <User size={12} className="text-secondary-foreground" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex space-x-2 justify-start">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Bot size={12} className="text-primary-foreground" />
            </div>
            <div className="bg-muted rounded-md px-3 py-2">
              <div className="flex items-center space-x-2">
                <Loader2 size={14} className="animate-spin text-primary" />
                <span className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-serif)' }}>
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about blog posts, projects, or anything else..."
            className="flex-1 resize-none border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground placeholder:text-muted-foreground"
            style={{ fontFamily: 'var(--font-sans)' }}
            rows={2}
            disabled={isLoading}
          />
          <div className="flex flex-col space-y-1">
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-md p-2 transition-colors duration-200"
            >
              <Send size={16} />
            </button>
            <button
              onClick={clearChat}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-md p-2 transition-colors duration-200 text-xs"
              title="Clear chat"
            >
              <X size={12} />
            </button>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
          <span style={{ fontFamily: 'var(--font-serif)' }}>
            Press Enter to send • Shift+Enter for new line
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatAgent; 