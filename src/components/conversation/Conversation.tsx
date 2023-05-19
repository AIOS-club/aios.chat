import React, { useCallback, useRef, useState } from 'react';
import classNames from 'classnames';
import html2canvas from 'html2canvas';
import {
  Spin, Icon, ImagePreview, Toast, Checkbox 
} from '@douyinfe/semi-ui';
import { IconCopy, IconUser } from '@douyinfe/semi-icons';
import ReactMarkdown from 'react-markdown';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm'; // table
import remarkMath from 'remark-math'; // math
import rehypeKatex from 'rehype-katex'; // katex
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Share from '@/assets/svg/share.svg';
import aiAvator from '@/assets/img/aiAvator.jpg';
import type { Conversation as Con, ConversationProps } from './ConversationProps';
import styles from './Conversation.module.less';
import './github.css';
import './katex.min.css';

const defaultClass = 'md:px-5 w-full border-b border-black/10 text-gray-800';
const shareBtnCls = 'absolute top-10 right-0 w-10 h-7 flex justify-center items-center btn-neutral rounded-l html2canvas-ignore';

const AI_AVATOR = import.meta.env.VITE_AI_AVATOR_URL;
const USER_AVATOR = import.meta.env.VITE_USER_AVATOR_URL;

const Conversation: React.FC<ConversationProps> = function Conversation(props) {
  const { data, showCheck, checkList, onCheckListChange } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [previewSrc, serPreviewSrc] = useState<string>('');

  const ref = useRef<HTMLDivElement>(null);

  const renderAvator = useCallback((character: 'user' | 'bot') => {
    if (character === 'user' && !USER_AVATOR) {
      return <IconUser className="w-full flex items-center justify-center dark:text-white" size="large" />;
    }
    const userUrl = USER_AVATOR;
    const aiUrl = AI_AVATOR || aiAvator;
    return <img className="rounded-sm" alt="" src={character === 'user' ? userUrl : aiUrl} />;
  }, []);

  const renderCode = useCallback((codeProps: CodeProps) => {
    const { children, className, inline } = codeProps;
    const code = String(children);
    const match = /language-(\w+)/.exec(className || '');
    const language = match?.[1] || 'plainxt';
    return !inline ? (
      <div className="w-full pt-8 relative text-white">
        <div className="absolute top-0 left-0 px-3 bg-[#343541] w-full h-8 leading-8 flex justify-between">
          <span className="flex-shrink-0">{language}</span>
          <CopyToClipboard text={code} onCopy={() => Toast.success('Copy successfully')}>
            <button type="button" className="w-0 flex-grow text-right cursor-pointer">
              <IconCopy className="align-middle mr-2" />
              Copy code
            </button>
          </CopyToClipboard>
        </div>
        <Prism
          language={language}
          PreTag="div"
          style={materialDark}
          customStyle={{
            width: '100%', overflow: 'auto', padding: '16px 12px', margin: '0', background: '#242c37'
          }}
          codeTagProps={{ style: { margin: 0 } }}
        >
          {code}
        </Prism>
      </div>
    ) : (
      <code className={className}>{children}</code>
    );
  }, []);

  const handleClick = async () => {
    const element = ref.current;
    if (!element || loading) return;
    setLoading(true);
    await html2canvas(element, {
      scale: 2, // 缩放比例高一点, 让图片更清晰一点
      useCORS: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.clientWidth,
      windowHeight: document.documentElement.clientHeight,
      ignoreElements: (_element) => _element.className?.includes?.('html2canvas-ignore'),
    }).then((_canvas) => {
      let canvas = _canvas;
      if (canvas.width > 2000) {
        // 新建Canvas对象
        const newCanvas = document.createElement('canvas');
        const ctx = newCanvas.getContext('2d');
        // 设置新Canvas的宽高
        const newWidth = 2000; // 设置新Canvas的宽度
        const newHeight = canvas.height; // 新Canvas的高度与原Canvas相同
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        // 计算需要截取的中间部分的起始位置
        const startX = (canvas.width - newWidth) / 2;
        if (ctx) {
          // 在新Canvas中绘制裁剪后的图像
          ctx.drawImage(canvas, startX, 0, newWidth, newHeight, 0, 0, newWidth, newHeight);
          canvas = newCanvas;
        }
      }
      const dataURL = canvas.toDataURL('image/png');
      serPreviewSrc(dataURL);
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleCheckChange = (user: Con, bot: Con) => {
    if (!showCheck) return;
    const cacheCheckList = [...checkList];
    const checked = cacheCheckList.some((item) => item.conversationId === user.conversationId);
    if (checked) {
      const curConversation = cacheCheckList.findIndex((item) => item.conversationId === user.conversationId);
      cacheCheckList.splice(curConversation, 2);
    } else {
      cacheCheckList.push(user, bot);
    }
    onCheckListChange(cacheCheckList);
  };

  return (
    <div className="flex flex-col items-center text-sm" ref={ref}>
      {data.map((d, index, arr) => (
        <div
          key={d.key}
          className={classNames(defaultClass, { 'bg-gray-50 dark:bg-[#232429]': d.character !== 'user', 'cursor-pointer': showCheck })}
          onClick={() => handleCheckChange(d, d.character === 'user' ? arr[index + 1] : arr[index - 1])}
        >
          <div className="gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
            <div className="w-[30px] flex flex-col items-end flex-shrink-0">
              {showCheck ? (
                <Checkbox
                  checked={checkList.some((item) => item.key === d.key)}
                  onChange={() => handleCheckChange(d, d.character === 'user' ? arr[index + 1] : arr[index - 1])}
                />
              ) : renderAvator(d.character)}
            </div>
            <div className="markdown-body w-0 flex-grow">
              <div
                className={classNames('min-h-[20px] flex flex-col items-start gap-4', {
                  [styles.error]: d.error,
                  [styles.loading]: !d.stop && d.character !== 'user',
                  [styles.start]: d.character !== 'user' && !d.value,
                  'whitespace-pre-line': d.character === 'user'
                })}
              >
                {d.character !== 'user' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{ code: renderCode }}
                  >
                    {d.value}
                  </ReactMarkdown>
                ) : d.value}
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="w-full h-48 flex items-center m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl py-4 px-12 md:py-6 flex-shrink-0 share-btn-custom" />
      {!showCheck && (
        <button type="button" className={classNames(shareBtnCls, styles.share)} onClick={handleClick}>
          {loading ? <Spin /> : <Icon svg={<Share />} />}
        </button>
      )}
      <ImagePreview
        src={previewSrc}
        visible={!!previewSrc}
        onClose={() => serPreviewSrc('')}
      />
    </div>
  );
};

export default Conversation;
