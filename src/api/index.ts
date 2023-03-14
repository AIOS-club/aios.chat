import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { fetch } from '@/utils';

function useFetchAnswer(): SWRMutationResponse {
  const fetcher = async (url: string, { arg }: any) => {
    Object.assign(arg, { model: 'gpt-3.5-turbo' });
    return fetch(url, arg, 'POST');
  };

  return useSWRMutation('https://api.aioschat.com', fetcher);
}

export { useFetchAnswer };
