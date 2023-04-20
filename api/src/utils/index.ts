import { ChatCompletionRequestMessage } from 'openai';

const ErrorMessage: { [key: string]: string } = {
  400: 'Bad Request',
  401: 'API KEY ERROR',
  403: 'Server Refused to Access',
  429: 'Request frequency is too high. Please try again later.',
  502: 'Gateway error. Please try again later.',
  503: 'The server is busy. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
  500: 'The server is busy. Please try again later.',
};

/**
 * Parse a string from a stream
 */
function parseStreamText(data: string) {
  const dataList = data?.split('\n')?.filter((l) => l !== '');

  const result = { role: 'assistant', content: '', stop: false };

  dataList.forEach((l) => {
    const jsonStr = l.replace('data: ', '');

    if (jsonStr === '[DONE]') {
      result.stop = true;
    } else {
      const jsonObj = JSON.parse(jsonStr);
      const delta = jsonObj.choices[0].delta as ChatCompletionRequestMessage;
      if (delta.role) result.role = delta.role;
      else if (delta.content) {
        result.content = `${result.content}${delta.content}`;
      }
    }
  });

  return result;
}

export { parseStreamText, ErrorMessage };
