import { MouseEventHandler, useCallback } from 'react';
import { Avatar, useChannelActionContext, useChannelStateContext, useChatContext } from 'stream-chat-react';

import { PinIcon } from '../../assets';

import { ChannelInfoIcon } from './ChannelInfoIcon';
import { useWorkspaceController } from '../../context/WorkspaceController';

import type { StreamChatType } from '../../types';

export const TeamChannelHeader = () => {
  const { displayWorkspace } = useWorkspaceController();
  const { client } = useChatContext<StreamChatType>();
  const { channel, watcher_count } = useChannelStateContext<StreamChatType>();
  const { closeThread } = useChannelActionContext<StreamChatType>();
  const { togglePinnedMessageListOpen } = useWorkspaceController();

  const teamHeader = `# ${channel?.data?.name || channel?.data?.id || 'random'}`;

  const openChannelEditPanel = useCallback(() => {
    displayWorkspace('Admin-Channel-Edit');
  }, [displayWorkspace]);

  const onPinIconClick: MouseEventHandler = useCallback((event) => {
    closeThread?.(event);
    togglePinnedMessageListOpen();
  }, [closeThread, togglePinnedMessageListOpen])

  const getMessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    const additionalMembers = members.length - 3;

    if (!members.length) {
      return (
        <div className='workspace-header__block'>
          <Avatar image={null} size={32} />
          <p className='team-channel-header__name user'>Johnny Blaze</p>
        </div>
      );
    }

    return (
      <div className='workspace-header__block'>
        {members.map(({ user }, i) => {
          if (i > 2) return null;
          return (
            <div key={i} className='workspace-header__block-item'>
              <Avatar image={user?.image} name={user?.name || user?.id} size={32} />
              <p className='team-channel-header__name user'>
                {user?.name || user?.id || 'Johnny Blaze'}
              </p>
            </div>
          );
        })}
        {additionalMembers > 0 && (
          <p className='team-channel-header__name user'>{`and ${additionalMembers} more`}</p>
        )}
      </div>
    );
  };

  const getWatcherText = (watchers?: number) => {
    if (!watchers) return 'No users online';
    if (watchers === 1) return '1 user online';
    return `${watchers} users online`;
  };

  return (
    <div className='team-channel-header__container'>
      {channel.type === 'messaging' ? (
        getMessagingHeader()
      ) : (
        <div className='workspace-header__block'>
          <div className='team-channel-header__name workspace-header__title'>{teamHeader}</div>
          <button onClick={openChannelEditPanel}>
            <ChannelInfoIcon />
          </button>
        </div>
      )}
      <div className='workspace-header__block'>
        <div className='workspace-header__subtitle'>{getWatcherText(watcher_count)}</div>
        <button
          className='workspace-header__subtitle'
          onClick={onPinIconClick}
        >
          <PinIcon />
          Pins
        </button>
      </div>
    </div>
  );
};
