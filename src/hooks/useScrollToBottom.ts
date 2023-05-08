import { useRef } from 'react';
import throttle from 'lodash/throttle';

function useScrollToBottom(): [React.MutableRefObject<any>, () => void] {
  const ref = useRef<HTMLElement>();

  const scrollToBottom = throttle(() => {
    if (ref.current?.scrollTo && typeof ref.current.scrollTo === 'function') {
      ref.current.scrollTo?.({ left: 0, top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, 1000, { leading: true, trailing: false });

  return [ref, scrollToBottom];
}

export default useScrollToBottom;
