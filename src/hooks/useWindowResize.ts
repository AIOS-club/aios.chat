import React, { useEffect } from 'react';
import useCallbackRef from './useCallbackRef';

function useWindowResize(callback: (width: number, height: number) => void) {
  const callbackRef = useCallbackRef(callback);

  useEffect(() => {
    const handleResize = () => {
      callbackRef(window.innerWidth, window.innerHeight);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [callbackRef]);
}

export default useWindowResize;
