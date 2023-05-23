const API_HOST_LIST = {
  'gpt-3.5-turbo': import.meta.env.VITE_API_HOST || 'https://api.openai.com/v1/chat/completions',
  'gpt-4': import.meta.env.VITE_API_HOST_GPT4 || 'https://api.openai.com/v1/chat/completions'
};

const ONLY_TEXT: string = import.meta.env.VITE_ONLY_TEXT;

export { API_HOST_LIST, ONLY_TEXT };
