import OpenAI from 'openai';

// Free models available on OpenRouter
export const FREE_MODELS = {
  // High-performance free models
  LLAMA_4_MAVERICK: 'meta-llama/llama-4-maverick:free',
  LLAMA_4_SCOUT: 'meta-llama/llama-4-scout:free',
  GEMINI_2_5_PRO: 'google/gemini-2.5-pro-exp-03-25:free',
  MISTRAL_SMALL: 'mistralai/mistral-small-3.1-24b-instruct:free',
  DEEPSEEK_CHAT: 'deepseek/deepseek-chat-v3-0324:free',
  QWEN_3_30B: 'qwen/qwen3-30b-a3b:free',
  
  // Lightweight models for quick responses
  NVIDIA_NEMOTRON: 'nvidia/llama-3.1-nemotron-nano-8b-v1:free',
  DEEPSEEK_R1: 'deepseek/deepseek-r1-zero:free',
  DEEPHERMES_3: 'nousresearch/deephermes-3-llama-3-8b-preview:free',
  
  // Multimodal models
  KIMI_VL: 'moonshotai/kimi-vl-a3b-thinking:free',
  QWEN_VL_3B: 'qwen/qwen2.5-vl-3b-instruct:free',
  
  // OpenRouter's own models
  OPTIMUS_ALPHA: 'openrouter/optimus-alpha',
  QUASAR_ALPHA: 'openrouter/quasar-alpha',
};

// Default model for the chat agent (best balance of performance and speed)
export const DEFAULT_MODEL = FREE_MODELS.DEEPSEEK_CHAT;

// Initialize OpenRouter client
export const openrouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'YashrajMaher Chat Agent',
  },
});

// Model configurations for different use cases
export const MODEL_CONFIGS = {
  // For general chat and questions
  GENERAL: {
    model: FREE_MODELS.DEEPSEEK_CHAT,
    temperature: 0.6,
    max_tokens: 1500,
    top_p: 0.9,
  },
  
  // For search and retrieval tasks
  SEARCH: {
    model: FREE_MODELS.DEEPSEEK_CHAT,
    temperature: 0.2,
    max_tokens: 1200,
    top_p: 0.8,
  },
  
  // For technical/coding questions
  TECHNICAL: {
    model: FREE_MODELS.DEEPSEEK_R1,
    temperature: 0.1,
    max_tokens: 1500,
    top_p: 0.85,
  },
  
  // For multimodal tasks
  MULTIMODAL: {
    model: FREE_MODELS.QWEN_VL_3B,
    temperature: 0.4,
    max_tokens: 1000,
    top_p: 0.9,
  },
};

// Smart model selection - automatically picks the best model for any query
export const selectOptimalModel = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Technical/coding questions
  if (lowercaseMessage.includes('code') || lowercaseMessage.includes('programming') || 
      lowercaseMessage.includes('technical') || lowercaseMessage.includes('development') ||
      lowercaseMessage.includes('api') || lowercaseMessage.includes('framework')) {
    return MODEL_CONFIGS.TECHNICAL;
  }
  
  // Search and discovery queries
  if (lowercaseMessage.includes('search') || lowercaseMessage.includes('find') || 
      lowercaseMessage.includes('show me') || lowercaseMessage.includes('latest') ||
      lowercaseMessage.includes('what') || lowercaseMessage.includes('posts') ||
      lowercaseMessage.includes('projects') || lowercaseMessage.includes('blog')) {
    return MODEL_CONFIGS.SEARCH;
  }
  
  // Default to general conversation
  return MODEL_CONFIGS.GENERAL;
};

// Rate limiting and error handling helper
export const safeApiCall = async (apiCall, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}; 