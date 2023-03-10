import { useChatContext, useTypingContext } from 'stream-chat-react';

import type { StreamChatType } from '../../types';

export const TeamTypingIndicator = () => {
  const { client } = useChatContext<StreamChatType>();

  const { typing } = useTypingContext<StreamChatType>();

  if (!client || !typing) return null;

  const users = Object.values(typing)
    .filter(({ user }) => user?.id !== client.user?.id)
    .map(({ user }) => user?.name || user?.id);

  if (!users.length) return null;

  let text = 'Someone is typing';

  if (users.length === 1) {
    text = `${users[0]} is typing`;
  } else if (users.length === 2) {
    text = `${users[0]} and ${users[1]} are typing`;
  } else if (users.length > 2) {
    text = `${users[0]} and ${users.length - 1} more are typing`;
  }

  return (
    <div className='typing-indicator__input'>
      <div className='dots'>
        <div className='dot' />
        <div className='dot' />
        <div className='dot' />
      </div>
      <div className='typing-indicator__input__text'>{text}</div>
    </div>
  );
};
