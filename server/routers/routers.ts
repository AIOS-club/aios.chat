import Router from 'koa-router';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import { getSystemMessage } from '../utils';
import env from '../config';

interface Body {
  messages: ChatCompletionRequestMessage[];
}

const router = new Router();

const config = new Configuration({ apiKey: env.API_KEY });

const openai = new OpenAIApi(config);

router.post('/aios-chat', async (ctx) => {
  const body = ctx.request.body as Body;

  const { messages } = body;

  ctx.set('Cache-Control', 'no-cache');
  ctx.set('Content-Type', 'text/event-stream');
  ctx.set('Connection', 'keep-alive');

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

  ctx.status = 200;

  res.data.on('data', (data: any) => {
    ctx.res.write(data.toString()); // 将每次返回的值发送到客户端
  });

  res.data.on('end', () => {
    ctx.res.end(); // 当流结束时关闭连接
  });

  res.data.on('error', () => {
    ctx.status = 500;
  });

  ctx.respond = false; // 禁用Koa的默认响应处理
});

export default router;
