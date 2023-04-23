/* eslint-disable max-len */
import React, { useRef, useState, useEffect } from 'react';
import { Icon } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import Loading from '@/components/loading';
import Lark from '@/assets/svg/lark.svg';
import { AutoTextAreaProps } from './AutoTextArea';
import styles from './AutoTextArea.module.less';

const placeholder = import.meta.env.VITE_DEFAULT_PLACEHOLDER;

const AutoTextArea: React.FC<AutoTextAreaProps> = function AutoTextArea(props) {
  const {
    value,
    disabled,
    loading,
    onButtonClick,
    onChange,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
  } = props;

  const [textareaHeight, setTextareaHeight] = useState<number>(21);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const height = value ? textareaRef.current.scrollHeight : 21;
      setTextareaHeight(height);
    }
  }, [value]);

  return (
    <div className="flex flex-col w-full py-2 pl-3 md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
      <textarea
        ref={textareaRef}
        className={classNames('scrollbar-hide', styles.textarea)}
        disabled={disabled}
        style={{ height: `${textareaHeight}px`, maxHeight: '200px' }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
      />
      {loading ? <Loading /> : (
        <button
          disabled={disabled}
          type="button"
          className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
          onClick={onButtonClick}
        >
          <Icon svg={<Lark />} style={{ display: 'inline' }} />
        </button>
      )}
    </div>
  );
};

export default AutoTextArea;
