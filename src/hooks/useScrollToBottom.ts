import { useLayoutEffect, useRef } from 'react';

function useScrollToBottom<T = any> (deps?: any): T {
  const ref = useRef<HTMLElement>();

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.scrollTo?.({ left: 0, top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, [deps]);

  return ref as T;
}

export default useScrollToBottom;
