import moment from 'moment';
import { ChatCompletionRequestMessage } from 'openai';

const systemMessages: ChatCompletionRequestMessage[] = [
  { role: 'system', content: '请以markdown的形式返回答案' },
  { role: 'system', content: '当你返回代码时，请在最末位返回```用以保持前端的渲染' }
];

function getSystemMessage (): ChatCompletionRequestMessage[] {
  const currentTime: ChatCompletionRequestMessage = { role: 'system', content: `现在的北京时间是: ${moment().format('YYYY-MM-DD HH:mm:ss')} ${moment().format('dddd')}` };
  return [currentTime, ...systemMessages];
}

export { getSystemMessage };
