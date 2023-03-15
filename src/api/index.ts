import useSWRMutation, { SWRMutationResponse } from 'swr/mutation';
import { fetch } from '@/utils';

const API_HOST: string = import.meta.env.VITE_API_HOST;

function useFetchAnswer(): SWRMutationResponse {
  const fetcher = async (url: string, { arg }: any) => {
    Object.assign(arg, { model: 'gpt-3.5-turbo' });
    return fetch(url, arg, 'POST');
  };

  return useSWRMutation(API_HOST, fetcher);
}

export { useFetchAnswer };
