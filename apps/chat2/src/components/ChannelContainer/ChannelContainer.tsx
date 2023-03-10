import { Channel, SimpleReactionsList } from 'stream-chat-react';

import { AdminPanel } from '../AdminPanel/AdminPanel';
import { ChannelInner } from './ChannelInner';
import { EmptyChannel } from '../EmptyChannel/EmptyChannel';
import { TeamMessageInput } from '../TeamMessageInput/TeamMessageInput';
import {TeamTypingIndicator} from '../TeamTypingIndicator/TeamTypingIndicator';
import { ThreadHeader } from '../TeamChannelHeader/ThreadHeader';
import { TeamMessage } from '../TeamMessage/TeamMessage';

import { GiphyInMessageFlagProvider } from '../../context/GiphyInMessageFlagContext';
import { useWorkspaceController } from '../../context/WorkspaceController';

const LoadingIndicator = () => null;

export const ChannelContainer = () => {
  const { activeWorkspace } = useWorkspaceController();

  if (activeWorkspace.match('Admin')) {
    return <AdminPanel/>;
  }

  return (
    <div className='channel__container'>
      <Channel
        EmptyStateIndicator={EmptyChannel}
        LoadingIndicator={LoadingIndicator}
        Input={TeamMessageInput}
        Message={TeamMessage}
        ReactionsList={SimpleReactionsList}
        ThreadHeader={ThreadHeader}
        TypingIndicator={TeamTypingIndicator}
      >
        <GiphyInMessageFlagProvider>
          <ChannelInner />
        </GiphyInMessageFlagProvider>
      </Channel>
    </div>
  );
};
