/* eslint-disable max-len */
import React, { useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Icon } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import Loading from '@/components/loading';
import Lark from '@/assets/svg/lark.svg';
import useIsMobile from '@/hooks/useIsMobile';
import { AutoTextAreaProps } from './AutoTextArea';
import styles from './AutoTextArea.module.less';

const placeholder = import.meta.env.VITE_DEFAULT_PLACEHOLDER;

const AutoTextArea: React.FC<AutoTextAreaProps> = function AutoTextArea(props) {
  const { loading, onFetchAnswer } = props;

  const [value, setValue] = useState<string>('');
  const [height, setHeight] = useState<number>(21);
  const [isComposition, setIsComposition] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (textareaRef.current) {
      const h = value ? textareaRef.current.scrollHeight : 21;
      setHeight(h);
    }
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: v } = e.target;
    setValue(v);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (loading || isComposition) return;
      const textArea = e.target as HTMLTextAreaElement;
      const v = textArea?.value?.trim();
      if (v && isMobile) textArea?.blur();
      onFetchAnswer(v).catch(() => {});
      setValue('');
    }
  }, [isComposition, isMobile, loading, onFetchAnswer]);

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) return;
    onFetchAnswer(value).catch(() => {});
    setValue('');
  }, [onFetchAnswer, value, loading]);

  return (
    <div className="flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <textarea
        ref={textareaRef}
        className={classNames('scrollbar-hide', styles.textarea)}
        style={{ maxHeight: '200px', height }}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onCompositionStart={() => setIsComposition(true)}
        onCompositionEnd={() => setIsComposition(false)}
      />
      {loading ? <Loading /> : (
        <button
          type="button"
          className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
          onClick={handleButtonClick}
        >
          <Icon svg={<Lark />} style={{ display: 'inline' }} />
        </button>
      )}
    </div>
  );
};

export default AutoTextArea;
