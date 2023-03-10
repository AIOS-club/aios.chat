import { useCallback } from 'react';
import { useWorkspaceController } from '../../context/WorkspaceController';
import { AdminPanelForm, FormValues } from './context/AdminPanelFormContext';
import { CreateChannel } from './CreateChannel';
import { EditChannel } from './EditChannel';
import { useChatContext } from 'stream-chat-react';
import { StreamChatType } from '../../types';
import { useTeamContext } from '../../hooks/useTeamContext';

export const AdminPanel = () => {
  const { client, channel } = useChatContext<StreamChatType>();
  const { displayWorkspace, activeWorkspace } = useWorkspaceController();
  const onSubmit = useCallback(() => displayWorkspace('Chat'), [displayWorkspace]);

  let defaultFormValues: FormValues = {name: '', members: []};
  let Form = null;

  const { team } = useTeamContext();

  if (activeWorkspace.match('Channel-Create')) {
    defaultFormValues = { members: client.userID ? [client.userID] : [], name: '', team:team };
    Form = CreateChannel;
  } else if (activeWorkspace.match('Channel-Edit')) {
    defaultFormValues= { members: [], name: channel?.data?.name || (channel?.data?.id as string), };
    Form = EditChannel;
  }
  return (
    <AdminPanelForm workspace={activeWorkspace} onSubmit={onSubmit} defaultValues={defaultFormValues}>
      <div className='channel__container'>
        { Form && <Form />}
      </div>
    </AdminPanelForm>
  );
};