import { ChannelList } from 'stream-chat-react';

import { ChannelSearch } from '../ChannelSearch/ChannelSearch';
import { TeamChannelList } from '../TeamChannelList/TeamChannelList';
import { ChannelPreview } from '../ChannelPreview/ChannelPreview';

import { CompanyLogo } from './icons';

import type { Channel, ChannelFilters, OwnUserResponse, ConnectionOpen, ExtendableGenerics, DefaultGenerics } from 'stream-chat';
import { ChannelSort } from 'stream-chat';

import { StreamChatType } from '../../types';
import { client, connectUserPromise } from '../../common/client';
import { useEffect, useState } from 'react';
import { useTeamContext } from '../../hooks/useTeamContext';

const filters: ChannelFilters[] = [
  { type: 'team', demo: 'team', team: {$in: [""]}  },
  { type: 'messaging', demo: 'team', team: {$in: [""]} },
];
const options = { state: true, watch: true, presence: true, limit: 3 };
const sort: ChannelSort<StreamChatType> = { last_message_at: -1, updated_at: -1 };

const FakeCompanySelectionBar = (props: { children: React.ReactNode }) => (
  <div className='sidebar__company-selection-bar'>
    { props.children }
  </div>
);

const customChannelTeamFilter = (channels: Channel[]) => {
  console.log('channels', channels)
  return channels.filter((channel) => channel.type === 'team');
};

const customChannelMessagingFilter = (channels: Channel[]) => {
  console.log('channels', channels)
  return channels.filter((channel) => channel.type === 'messaging');
};

const TeamChannelsList = () => {
  const { team } = useTeamContext();
  const filters = { type: 'team', demo: 'team', team: {$in: [team]}  };
  if (!team) {
    return null;
  }

  return <ChannelList
    channelRenderFilterFn={customChannelTeamFilter}
    filters={filters}
    options={options}
    sort={sort}
    List={(listProps) => (
      <TeamChannelList
        {...listProps}
        type='team'
      />
    )}
    Preview={(previewProps) => (
      <ChannelPreview
        {...previewProps}
        type='team'
      />
    )}
  />
};

const MessagingChannelsList = () => (
  <ChannelList
    channelRenderFilterFn={customChannelMessagingFilter}
    filters={filters[1]}
    options={options}
    sort={sort}
    setActiveChannelOnMount={false}
    List={(listProps) => (
      <TeamChannelList
        {...listProps}
        type='messaging'
      />
    )}
    Preview={(previewProps) => (
      <ChannelPreview
        {...previewProps}
        type='messaging'
      />
    )}
  />
)

export const Sidebar = () => {
  const { user, team, setTeam } = useTeamContext()
  return (
    <div className='sidebar'>
      <FakeCompanySelectionBar>
        <div>
          {
            user?.teams?.map((team) => {
              return <div  key={team} className='sidebar__company-badge mb-4 cursor-pointer' onClick={() => {
                setTeam(team)
              }}>
                  {team}
              </div>
            })
          }
        </div>
      </FakeCompanySelectionBar>
      <div className='channel-list-bar'>
        <div className='channel-list-bar__header flex justify-center items-center'>
          <p className='channel-list-bar__header__text'>{ team }</p>
        </div>
        <ChannelSearch />
        <TeamChannelsList/>
        <MessagingChannelsList/>
      </div>
    </div>
  );
};
