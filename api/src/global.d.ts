import { ChatCompletionRequestMessage } from 'openai';

export interface Body {
  messages: ChatCompletionRequestMessage[];
  frequency_penalty?: number;
  model?: string;
  presence_penalty?: number;
  temperature?: number;
  stream?: boolean;
}