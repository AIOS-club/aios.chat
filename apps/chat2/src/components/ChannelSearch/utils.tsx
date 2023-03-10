import type { Channel, ChannelFilters, StreamChat, UserResponse } from 'stream-chat';

import type { StreamChatType } from '../../types';

export type ChannelOrUserType =
  | Channel<StreamChatType>
  | UserResponse<StreamChatType>;

export const isChannel = (
  channel: ChannelOrUserType,
): channel is Channel<StreamChatType> =>
  (channel as Channel<StreamChatType>).cid !== undefined;

type Props = {
  client: StreamChat<StreamChatType>;
  setActiveChannel: (
    newChannel?: Channel<StreamChatType>,
    watchers?: {
      limit?: number;
      offset?: number;
    },
    event?: React.SyntheticEvent,
  ) => void;
  user: UserResponse<StreamChatType>;
};

export const channelByUser = async (props: Props) => {
  const { client, setActiveChannel, user } = props;

  const filters: ChannelFilters = {
    type: 'messaging',
    member_count: 2,
    members: { $eq: [user.id as string, client.userID || ''] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) {
    return setActiveChannel(existingChannel);
  }

  const newChannel = client.channel('messaging', {
    members: [user.id as string, client.userID || ''],
  });
  return setActiveChannel(newChannel);
};
