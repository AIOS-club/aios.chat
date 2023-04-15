import React, { useMemo } from 'react';
import data from '@emoji-mart/data';
import { Tooltip } from '@douyinfe/semi-ui';
import classNames from 'classnames';
import Emoji from '@/components/emoji';
import { ChatIconProps } from './ChatIconPorps';

const { emojis } = data as Record<string, any>;

const EmojiIdList = Object.keys(emojis);

function randomElement(arr: any[], str: string) {
  let seed = 0;
  if (!str) {
    // 如果输入字符串为空，直接返回随机数组元素
    return arr[Math.floor(Math.random() * arr.length)];
  }
  str.split('').forEach((_, i) => {
    seed += str.charCodeAt(i);
  });
  const randomIndex = Math.floor(seed % arr.length); // 对数组长度取模，得到随机索引
  return arr[randomIndex];
}

const ChatIcon: React.FC<ChatIconProps> = function ChatIcon(props) {
  const { chat, className, size } = props;

  const { chatId, title, data: conversation, icon } = chat;

  const content = title || conversation[0]?.value || '[empty]';

  const id = useMemo(() => randomElement(EmojiIdList, chatId), [chatId]);

  const renderContent = useMemo(() => <div className="max-h-80 p-1 overflow-hidden">{content}</div>, [content]);

  return (
    <Tooltip position="right" trigger="hover" content={renderContent} mouseEnterDelay={200} mouseLeaveDelay={201}>
      <div className={classNames(className, 'h-full flex items-center justify-center')}>
        <Emoji id={icon?.id || id} size={size || '2rem'} />
      </div>
    </Tooltip>
  );
};

export default ChatIcon;
