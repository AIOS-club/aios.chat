import moment from 'moment';
import { ChatCompletionRequestMessage } from 'openai';

function getSystemMessage (): ChatCompletionRequestMessage[] {
  const currentTime: ChatCompletionRequestMessage = { role: 'system', content: `现在的北京时间是: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${moment().format('dddd')}` };
  const markdownRender: ChatCompletionRequestMessage = { role: 'system', content: '请以markdown的形式返回答案' };
  return [currentTime, markdownRender];
}

export { getSystemMessage };
