import axios from 'axios';
import { Conversation } from '@/components/conversation/Conversation';
import { Messages } from '@/global';

const CACHE_TIMES = parseInt(import.meta.env.VITE_CACHE_TIMES, 10);

async function fetch (url: string, params: any, type: 'POST' | 'GET' = 'GET', options: any = {}): Promise<any> {
  const method = type.toLocaleLowerCase();

  return axios({
    url,
    method,
    data: method === 'post' ? params : null,
    params: method === 'get' ? params : null,
    headers: {
      'Content-Type': 'application/json',
      ...options
    },
    timeout: 300000 // 5分钟
  });
}

/**
 * 获取前几次的用户对话信息
 * @param conversation
 * @param curValue
 * @param cacheTimes
 * @param maxTokensLength
 * @returns
 */
function getCachePrompt (conversation: Conversation[], curValue: string): Messages[] {
  const pairsConversation: Messages[] = [];
  try {
    for (let i = 0; i < conversation.length; i += 2) {
      const user = conversation[i];
      const gpt = conversation[i + 1];
      if (user && gpt && user.conversationId === gpt.conversationId && !gpt.error) {
        pairsConversation.push({ role: 'user', content: user.value });
        if (!gpt.loading) {
          pairsConversation.push({ role: 'assistant', content: gpt.value });
        }
      }
    }
    if (Number.isNaN(CACHE_TIMES) || CACHE_TIMES < 0) return pairsConversation;
    const startIndex = Math.max(pairsConversation.length - CACHE_TIMES, 0);
    return pairsConversation.slice(startIndex);
  } catch {
    return [{ role: 'user', content: curValue }];
  }
}

export { fetch, getCachePrompt };
