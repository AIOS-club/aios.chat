import Router from 'koa-router';
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from 'openai';
import env from '../config';

interface Body {
  messages: ChatCompletionRequestMessage[];
};

const router = new Router();

const config = new Configuration({ apiKey: env.API_KEY });

const openai = new OpenAIApi(config);

router.post('/aios-chat', async (ctx, next) => {
  const body = ctx.request.body as Body;

  if (!body || !Array.isArray(body.messages)) {
    ctx.status = 200;
    ctx.body = { choices: [{ block: true, text: 'Bad Request' }] };
    await next();
    return;
  }

  const { messages } = body;

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages,
    temperature: 0.8,
    n: 1, // 限制ai的回答数
    presence_penalty: -1.0, // 不轻易改变对话主题
    frequency_penalty: 1.0, // 减少重复已提及的内容
    // stream: true,
    // stop: []
    // max_tokens: 1000,
  });

  ctx.status = res.status;
  ctx.body = res.data;
});

export default router;
