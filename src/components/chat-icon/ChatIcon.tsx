import React, { useMemo } from 'react';
import data from '@emoji-mart/data';
import { init } from 'emoji-mart';
import { Tooltip } from '@douyinfe/semi-ui';
import { ChatList } from '@/global';

interface ChatIconProps {
  chat: ChatList;
}

init({ data }).catch(() => {});

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
  const { chat } = props;

  const { chatId, title, data: conversation } = chat;

  const content = title || conversation[0]?.value || '[empty]';

  const id = useMemo(() => randomElement(EmojiIdList, chatId), [chatId]);

  return (
    <Tooltip position="right" content={content} mouseEnterDelay={200} mouseLeaveDelay={201}>
      <div className="w-full h-full flex items-center justify-center">
        {/* @ts-expect-error */}
        <em-emoji id={id} size="2rem" />
      </div>
    </Tooltip>
  );
};

export default ChatIcon;
