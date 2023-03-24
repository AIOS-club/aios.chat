import Router from 'koa-router';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { getSystemMessage, parseStreamText, ErrorMessage } from '../utils';
import env from '../config';

const RETRIES = parseInt(env.RETRIES, 10) ?? 3;

interface Body {
  messages: ChatCompletionRequestMessage[];
  apiKey?: string;
}

const router = new Router();

const callOpenAI = async (
  openai: OpenAIApi,
  messages: ChatCompletionRequestMessage[],
  retries: number
): Promise<any> => {
  try {
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [...getSystemMessage(), ...messages],
      temperature: 0.8,
      n: 1, // 限制ai的回答数
      presence_penalty: -1.0, // 不轻易改变对话主题
      frequency_penalty: 1.0, // 减少重复已提及的内容
      stream: true,
      // stop: []
      // max_tokens: 1000,
    }, { responseType: 'stream' }) as any;

    return res;
  } catch (error) {
    if (retries === 0) throw error;
    return callOpenAI(openai, messages, retries - 1);
  }
};

router.post('/aios-chat', async (ctx) => {
  const body = ctx.request.body as Body;

  const { messages, apiKey } = body;

  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Content-Type', 'text/event-stream');
  ctx.set('Connection', 'keep-alive');

  try {
    const config = new Configuration({ apiKey: apiKey || env.API_KEY });

    const openai = new OpenAIApi(config);

    const res = await callOpenAI(openai, messages, RETRIES);

    ctx.status = 200;

    res.data.on('data', (data: any) => {
      const message = parseStreamText(data.toString());
      ctx.res.write(message.content); // 将每次返回的值发送到客户端
    });

    res.data.on('end', () => {
      ctx.res.end(); // 当流结束时关闭连接
    });
  } catch (error: any) {
    // Invalid character in header content ["Authorization"] 为API KEY 错误
    const statusCode: number = error.response ? error.response?.status : 401;
    ctx.status = statusCode;
    ctx.res.write(ErrorMessage[statusCode || 500] || 'Something is wrong, please try again');
    ctx.res.end();
  }

  ctx.respond = false; // 禁用Koa的默认响应处理
});

export default router;
