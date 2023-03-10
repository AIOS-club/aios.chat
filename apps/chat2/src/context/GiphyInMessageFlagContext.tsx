import React, { useCallback, useContext, useState } from 'react';

type GiphyState = Record<'main-input' | 'thread-input', boolean>

type GiphyStateObj = {
  clearGiphyFlag: (isReply: boolean) => void;
  clearGiphyFlagMainInput: () => void;
  clearGiphyFlagThread: () => void;
  inputHasGiphyMessage: (isReply: boolean) => boolean;
  isComposingGiphyMessage: () => boolean;
  isComposingGiphyReply: () => boolean;
  setComposeGiphyMessageFlag: () => void;
  setComposeGiphyReplyFlag: () => void;
};
export const GiphyInMessageFlagContext = React.createContext<GiphyStateObj>({} as GiphyStateObj);

export const GiphyInMessageFlagProvider = ({children}: {children: React.ReactNode}) => {
  const [giphyState, setGiphyState] = useState<GiphyState>({
    'main-input': false,
    'thread-input': false,
  });

  const clearGiphyFlag = useCallback((isReply: boolean) => {
    setGiphyState((prev) =>
      isReply
        ? {...prev, 'thread-input': false}
        : {...prev, 'main-input': false}
    );
  }, []);

  const clearGiphyFlagMainInput = useCallback(() => {
    setGiphyState((prev) => ({...prev, 'main-input': false}));
  }, []);

  const clearGiphyFlagThread = useCallback(() => {
    setGiphyState((prev) => ({...prev, 'thread-input': false}));
  }, []);

  const inputHasGiphyMessage = useCallback((isReply: boolean) => (
    isReply ? giphyState['thread-input'] : giphyState['main-input']
  ), [giphyState]);

  const isComposingGiphyMessage = useCallback(() => giphyState['main-input'], [giphyState]);

  const isComposingGiphyReply = useCallback(() => giphyState['thread-input'], [giphyState]);

  const setComposeGiphyMessageFlag = useCallback(() => {
    setGiphyState((prev) => ({...prev, 'main-input': true}));
  }, []);

  const setComposeGiphyReplyFlag = useCallback(() => {
    setGiphyState((prev) => ({...prev, 'thread-input': true}));
  }, []);

  return (
    <GiphyInMessageFlagContext.Provider value={{
      clearGiphyFlag,
      clearGiphyFlagMainInput,
      clearGiphyFlagThread,
      inputHasGiphyMessage,
      isComposingGiphyMessage,
      isComposingGiphyReply,
      setComposeGiphyMessageFlag,
      setComposeGiphyReplyFlag,
    }}>
      {children}
    </GiphyInMessageFlagContext.Provider>
  )
};

export const useGiphyInMessageContext = () => useContext(GiphyInMessageFlagContext);
