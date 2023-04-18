import { useState } from 'react';
import useWindowResize from './useWindowResize';

function useDockCount(): number {
  const [count, setCount] = useState<number>(() => {
    const maxDockHeight = (document.body.offsetHeight - 42) * 0.8; // dock栏的最大高度
    return Math.floor((maxDockHeight - 20) / 68);
  });
  
  useWindowResize((_, height) => {
    const maxDockHeight = (height - 42) * 0.8; // dock栏的最大高度
    setCount(Math.floor((maxDockHeight - 20) / 68));
  });

  return count - 1;
}

export default useDockCount;
