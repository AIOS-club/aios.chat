import { StreamMessage } from 'stream-chat-react';

import { PinIcon } from '../../assets';

import { StreamChatType } from '../../types';

export type PinIndicatorProps = {
  message?: StreamMessage<StreamChatType>;
};

export const PinIndicator = ({ message }: PinIndicatorProps) => {
  if (!message) return null;

  return (
    <div className='str-chat__message-team-pin-indicator'>
        <PinIcon />
          {message.pinned_by
            ? `Pinned by ${message.pinned_by?.name || message.pinned_by?.id}`
            : 'Message pinned'}
    </div>
  );
};
