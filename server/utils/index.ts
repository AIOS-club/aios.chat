import { ChatCompletionRequestMessage } from 'openai';

export const ErrorMessage: { [key: number]: string } = {
  400: 'Bad Request',
  401: 'API KEY ERROR',
  403: '服务器拒绝访问',
  429: '请求频率过高，请稍后再试',
  502: '网关错误，请稍后再试',
  503: '服务器繁忙，请稍后再试',
  504: '网关超时，请稍后再试',
  500: '服务器繁忙，请稍后再试',
};

/**
 * 解析stream流的字符串
 */
function parseStreamText(data: string) {
  const dataList = data?.split('\n')?.filter((l) => l !== '');

  const result = { role: 'assistant', content: '', stop: false };

  dataList.forEach((l) => {
    // 移除"data: "前缀
    const jsonStr = l.replace('data: ', '');

    if (jsonStr === '[DONE]') {
      result.stop = true;
    } else {
      // 将JSON字符串转换为JavaScript对象
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

export { parseStreamText };
