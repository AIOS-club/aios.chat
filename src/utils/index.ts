import { Conversation } from '@/components/conversation/ConversationProps';
import { Messages } from '@/global';

const CACHE_TIMES = parseInt(import.meta.env.VITE_CACHE_TIMES, 10);

/**
 * 获取前几次的用户对话信息
 */
function getCachePrompt (conversation: Conversation[], curValue: string): Messages[] {
  const pairsConversation: Messages[] = [];
  try {
    for (let i = 0; i < conversation.length; i += 2) {
      const user = conversation[i];
      const gpt = conversation[i + 1];
      if (user && gpt && user.conversationId === gpt.conversationId && !gpt.error) {
        pairsConversation.push({ role: 'user', content: user.value });
        if (gpt.stop) {
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

/**
 * 解析stream流的字符串
 */
function parseStreamText(data: string) {
  const dataList = data?.split('\n')?.filter((l) => l !== '');

  const result = { role: 'assistant', content: '', stop: false };

  dataList.forEach((l) => {
    // 移除"data: "前缀
    try {
      const jsonStr = l.replace('data: ', '');
  
      if (jsonStr === '[DONE]') {
        result.stop = true;
      } else {
        // 将JSON字符串转换为JavaScript对象
        const jsonObj = JSON.parse(jsonStr);
        const delta = jsonObj.choices[0].delta as Messages;
        if (delta.role) result.role = delta.role;
        else if (delta.content) {
          result.content = `${result.content}${delta.content}`;
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error((error));
    }
  });

  return result.content;
}

function parseMarkdown(chunk: string): string {
  let text = chunk;
  const matches = chunk.match(/```/g);
  const count = matches ? matches.length : 0;
  if (count % 2 !== 0) {
    // 如果计数为奇数，说明```没有成对，因此在字符串末尾添加```
    text += '\n```';
  }
  return text;
}

function getCurrentDate(noWeekDay: boolean = false): string {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const date = new Date();

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const dayOfWeek = daysOfWeek[date.getDay()];
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${noWeekDay ? '' : dayOfWeek}`;
}

function getDefaultSystemMessage() {
  return [
    'Return the answer in markdown format',
  ];
}

function getSystemMessages(message?: string | string[]): Messages[] {
  const systemMessages: Messages[] = [];
  if (Array.isArray(message) && message.length) {
    message.forEach((m) => systemMessages.push({ role: 'system', content: m }));
  } else if (typeof message === 'string') {
    systemMessages.push({ role: 'system', content: message });
  }
  return systemMessages;
}

export {
  getCachePrompt,
  parseMarkdown,
  parseStreamText,
  getDefaultSystemMessage,
  getSystemMessages,
  getCurrentDate,
};
