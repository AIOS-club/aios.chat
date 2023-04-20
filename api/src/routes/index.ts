import express from 'express';
import { OpenAIApi, CreateChatCompletionRequest } from 'openai';
import { Body } from '../global';
import { parseStreamText, ErrorMessage } from '../utils';
import env from '../utils/env';

const { API_KEY, RETRIES: STRING_RETRIES } = env;

const RETRIES = parseInt(STRING_RETRIES, 10) ?? 0;

const router = express.Router();

const openai = new OpenAIApi();

async function callOpenAI(
  request: CreateChatCompletionRequest,
  config: Record<string, any>,
  retries: number
): Promise<any> {
  return await openai.createChatCompletion(request, config).catch((error) => {
    if (error.message.includes('400')) {
      const { messages } = request;
      const chatList = messages.filter((message) => message.role !== 'system');
      if (chatList.length > 1) {
        const delIndex = messages.findIndex((message) => message.role !== 'system');
        messages.splice(delIndex, 1);
        return callOpenAI(request, config, retries);
      }
    }
    if (retries === 0) return error;
    return callOpenAI(request, config, retries - 1);
  });
}

router.post('/aios-chat', async (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Connection', 'keep-alive');

  const body = req.body as Body;
  const authorization = req.headers.authorization || `Bearer ${API_KEY}`;

  const { stream } = body;

  const chatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    n: 1,
    presence_penalty: -1.0,
    frequency_penalty: 1.0,
    stream: true,
    ...body,
  };

  const config = { responseType: stream ? 'stream' : 'json', headers: { authorization } };

  const answer = await callOpenAI(chatCompletionRequest, config, RETRIES);
  
  if (answer instanceof Error) {
    let status = 500;
    let errorMessage = ErrorMessage['500'];
    Object.keys(ErrorMessage).forEach((key: string) => {
      if (answer.message.includes(key)) {
        status = parseInt(key, 10);
        errorMessage = ErrorMessage[key];
      }
    });
    res.status(status).send(errorMessage);
  } else if (stream) {
    answer.data.on('data', (data: any) => {
      const chunk = parseStreamText(data.toString()).content;
      res.write(chunk);
    });
  
    answer.data.on('end', () => {
      res.end();
    });
  } else {
    let message = '';
    let status = 200;
    try {
      message = answer.data.choices[0].message.content;
    } catch {
      message = 'something went wrong';
      status = 500;
    }
    res.status(status).send(message);
  }
});

export default router;
