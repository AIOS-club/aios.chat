import { useCallback, useRef } from 'react';

function useScrollToBottom(): [React.MutableRefObject<any>, () => void] {
  const ref = useRef<HTMLElement>();

  const scrollToBottom = useCallback(() => {
    if (ref.current?.scrollTo && typeof ref.current.scrollTo === 'function') {
      ref.current.scrollTo?.({ left: 0, top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  return [ref, scrollToBottom];
}

export default useScrollToBottom;
