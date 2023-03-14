/* eslint-disable @typescript-eslint/promise-function-async */
import axios from 'axios';
import moment from 'moment';
import { encode } from '@/utils/encoder/encoder';
import { Conversation } from '@/components/conversation/Conversation';
import { Messages } from '@/global';

async function fetch (url: string, params: any, type: 'POST' | 'GET' = 'GET', options: any = {}): Promise<any> {
  const method = type.toLocaleLowerCase();

  return axios({
    url,
    method,
    data: method === 'post' ? params : null,
    params: method === 'get' ? params : null,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
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
    const valueTokensLength = encode(curValue).length; // 当前会话的长度
    const restTokensLength = 3000 - valueTokensLength;
    // 如果当前会话的长度就超过了最大值，那么直接返回，让后端报错
    if (restTokensLength <= 0) {
      return [{ role: 'user', content: curValue }];
    }
    let cacheConversation = pairsConversation.map(p => p.content).join('');
    while (pairsConversation.length > 0 && encode(cacheConversation).length > restTokensLength) {
      pairsConversation.shift();
      cacheConversation = pairsConversation.map(p => p.content).join('');
    }
    return pairsConversation;
  } catch {
    return [{ role: 'user', content: curValue }];
  }
}

/**
 * 获取prompt前置信息
 */
function getSystemMessage (): Messages[] {
  const currentTime: Messages = { role: 'system', content: `现在的北京时间是: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${moment().format('dddd')}` };
  const markdownRender: Messages = { role: 'system', content: '请以markdown的形式返回答案' };
  return [currentTime, markdownRender];
}

export { fetch, getCachePrompt, getSystemMessage };
