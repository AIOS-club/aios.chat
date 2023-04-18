import React from 'react';
import {
  useTransition, useSpring, useSpringRef, config, animated, useChain
} from '@react-spring/web';
import ChatIcon from '@/components/chat-icon';
import { LaunchPadProps } from './LaunchPad';

const LaunchPad: React.FC<LaunchPadProps> = function LaunchPad(props) {
  const { chatList, open, setOpen, onClickItem } = props;

  const springApi = useSpringRef();
  const transApi = useSpringRef();

  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: '0' },
    to: { size: open ? '100%' : '0' },
  });

  const transition = useTransition(open ? chatList : [], {
    ref: transApi,
    trail: 100 / chatList.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  useChain(open ? [springApi, transApi] : [transApi, springApi], [0, open ? 0.1 : 0.2]);

  return (
    <animated.div
      className="fixed top-0 left-0 z-[999] flex justify-center items-center bg-[#16161a]/60"
      style={{ ...rest, width: size, height: size }}
      onClick={() => setOpen((pre) => !pre)}
    >
      <div className="bg-white w-4/5 h-4/5 flex flex-wrap items-start rounded-md content-start overflow-y-scroll scrollbar-hide">
        {transition((style, item) => (
          <animated.div
            key={item.chatId}
            className="w-20 h-20 my-16 mx-12 cursor-pointer"
            style={{ ...style }}
            onClick={() => onClickItem(item)}
          >
            <ChatIcon chat={item} className="border border-gray-200 rounded-md" />
            <div className="w-full text-gray-800 text-center my-2 text-ellipsis overflow-hidden break-keep whitespace-nowrap">
              {item.title || item.data[0]?.value || '[empty]'}
            </div>
          </animated.div>
        ))}
      </div>
    </animated.div>
  );
};

export default LaunchPad;
