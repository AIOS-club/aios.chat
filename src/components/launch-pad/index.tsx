import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  useTransition, useSpring, useSpringRef, config, animated, useChain
} from '@react-spring/web';
import classNames from 'classnames';
import { IconClose } from '@douyinfe/semi-icons';
import ChatIcon from '@/components/chat-icon';
import useWindowResize from '@/hooks/useWindowResize';
import { LaunchPadProps } from './LaunchPad';

const chatIconCls = 'border-2 border-gray-200 rounded-md dark:border-slate-800 dark:bg-slate-800';

const LaunchPad: React.FC<LaunchPadProps> = function LaunchPad(props) {
  const {
    chatList, currentChat, open, setOpen, onClickItem, onDeleteItem
  } = props;

  const springApi = useSpringRef();
  const transApi = useSpringRef();

  const [originLeft, setLeft] = useState(0);
  const [originTop, setTop] = useState(0);

  const handleSetOriginLocation = () => {
    const launchElement = document.getElementById('launch') as HTMLDivElement;
    if (launchElement) {
      const { top, left } = launchElement.getBoundingClientRect();
      setLeft(left);
      setTop(top);
    }
  };

  useLayoutEffect(() => {
    handleSetOriginLocation();
  }, [chatList.length]);

  useWindowResize(handleSetOriginLocation);

  const [{ left, top }, api] = useSpring(() => ({
    left: originLeft,
    top: originTop,
    config: { frequency: 0.4 },
  }), [originLeft, originTop]);

  useEffect(() => {
    if (open) {
      api.start({ left: 0, top: 0 });
    } else {
      api.start({ left: originLeft, top: originTop });
    }
  }, [open, api, originLeft, originTop]);

  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: '0' },
    to: { size: open ? '100%' : '0' },
  });

  const transition = useTransition(open ? chatList : [], {
    ref: transApi,
    trail: 200 / chatList.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  useChain(open ? [springApi, transApi] : [transApi, springApi], [0, open ? 0.1 : 0.2]);

  return (
    <animated.div
      className="fixed z-[999] flex justify-center items-center bg-[#16161a]/60"
      onClick={() => setOpen((pre) => !pre)}
      style={{
        ...rest, width: size, height: size, left, top,
      }}
    >
      <div className="bg-white dark:bg-slate-900 w-4/5 h-4/5 flex flex-wrap items-start rounded-md content-start overflow-y-scroll scrollbar-hide">
        {transition((style, item) => (
          <animated.div
            key={item.chatId}
            className="w-20 h-20 my-16 mx-12 cursor-pointer relative"
            style={{ ...style }}
            onClick={() => onClickItem(item)}
          >
            <ChatIcon
              chat={item}
              className={classNames(chatIconCls, { 'border-[#000] dark:border-[#fff]': item.chatId === currentChat?.chatId })}
            />
            <div className="w-full text-gray-800 dark:text-white text-center my-2 text-ellipsis overflow-hidden break-keep whitespace-nowrap">
              {item.title || item.data[0]?.value || '[empty]'}
            </div>
            <div
              className="w-5 h-5 flex justify-center items-center absolute top-0 right-0 cursor-pointer translate-x-1/2 -translate-y-1/2 bg-gray-200 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteItem(item.chatId);
              }}
            >
              <IconClose size="small" />
            </div>
          </animated.div>
        ))}
      </div>
    </animated.div>
  );
};

export default LaunchPad;
