import React, { useCallback, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import classNames from 'classnames';
import html2canvas from 'html2canvas';
import ClipboardJS from 'clipboard';
import { marked } from 'marked';
import { Toast, Spin, Icon } from '@douyinfe/semi-ui';
import { Gallery, Item } from 'react-photoswipe-gallery';
import Flashing from '@/components/flashing';
import Share from '@/assets/share.svg';
import Bot from '@/assets/bot.svg';
import User from '@/assets/user.svg';
import { highlightCode, imgLoad } from './utils';
import { ConversationProps, Conversation as Con } from './Conversation';
import styles from './Conversation.module.less';
import 'highlight.js/styles/github-dark.css';
import 'photoswipe/dist/photoswipe.css';

const clipboard = new ClipboardJS('.copy-button', {
  text: (trigger: HTMLButtonElement) => decodeURIComponent(trigger.getAttribute('data-copy-text') || ''),
});

clipboard.on('success', () => {
  Toast.success('复制成功');
});

clipboard.on('error', () => {
  Toast.error('复制失败');
});

const defaultClass = 'w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group';
const conversationCls = 'answer min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap';
const shareBtnCls = 'absolute top-10 right-0 w-16 h-7 flex justify-center break-keep items-center btn-neutral rounded-l html2canvas-ignore';
const imageContentCls = 'pswp__img absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 object-contain';
const markdownCls = 'prose prose-p:m-0 prose-ul:m-0 prose-ul:leading-normal prose-li:m-0 prose-ol:m-0 prose-pre:w-full prose-pre:p-0 prose-pre:h-fit prose-pre:bg-black prose-pre:text-white w-0 flex-grow dark:prose-invert';

const Conversation: React.FC<ConversationProps> = (props) => {
  const { data } = props;

  const [loading, setLoading] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement>(null);

  const renderInnerHtml = useCallback((d: Con) => {
    return d.loading ? ReactDOMServer.renderToString(<Flashing />) : marked(d.value, { highlight: highlightCode });
  }, []);

  const renderImage = useCallback((d: Con) => (
    <Item content={<img alt="" className={imageContentCls} src={d.url} />}>
      {({ ref, open }) => (
        <img
          alt=""
          className="max-w-full max-h-full w-auto h-auto cursor-pointer"
          ref={ref as React.MutableRefObject<HTMLImageElement>}
          onClick={open}
          src={d.url}
        />
      )}
    </Item>
  ), []);

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
      ignoreElements: (element) => element.className?.includes?.('html2canvas-ignore'),
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
      const img = new Image();
      img.src = dataURL;
      img.addEventListener('load', imgLoad);
    }).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center text-sm dark:bg-gray-800" ref={ref}>
      <Gallery withDownloadButton>
        {data.map(d => (
          <div
            key={d.key}
            className={classNames(defaultClass, {
              'dark:bg-gray-800': d.character === 'user',
              'bg-gray-50 dark:bg-[#444654]': d.character !== 'user' // 兼容以前的AI-EDU
            })}
          >
            <div className="text-base gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
              <div className="w-[30px] flex flex-col relative items-end flex-shrink-0">
                <Icon svg={d.character === 'user' ? <User /> : <Bot />} />
              </div>
              <div className={markdownCls}>
                {d.type === 'image' ? renderImage(d) : (
                  <div
                    className={classNames(conversationCls, { [styles.error]: d.error })}
                    dangerouslySetInnerHTML={{ __html: renderInnerHtml(d) }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </Gallery>
      <div className="w-full h-48 flex items-center m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl py-4 px-12 md:py-6 flex-shrink-0 share-btn-custom"></div>
      <button className={classNames(shareBtnCls, styles.share)} onClick={handleClick}>
        {loading ? <Spin /> : <><Icon svg={<Share />} style={{ marginRight: 5 }} />分享</>}
      </button>
    </div>
  );
};

export default Conversation;
