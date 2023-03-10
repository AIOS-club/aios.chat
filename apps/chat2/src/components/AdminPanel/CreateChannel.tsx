import { AdminPanelHeader } from './AdminPanelHeader';
import { AdminPanelFooter } from './AdminPanelFooter';
import { ChannelNameInputField } from './ChannelNameInputField';
import { UserList } from './UserList';

import { useAdminPanelFormState } from './context/AdminPanelFormContext';
import { useWorkspaceController } from '../../context/WorkspaceController';

export const CreateChannel = () => {
  const { closeAdminPanel } = useWorkspaceController();
  const {createChannelType, name, handleInputChange, handleSubmit, errors} = useAdminPanelFormState();


  return (
    <div className='admin-panel__form'>
      <AdminPanelHeader onClose={closeAdminPanel}
                        title={createChannelType === 'team'
                          ? 'Create a New Channel'
                          : 'Send a Direct Message'}
      />
      {createChannelType === 'team' &&
        <ChannelNameInputField
          error={errors.name}
          name={name}
          onChange={handleInputChange}
          placeholder='channel-name (no spaces)' />
      }
      <UserList/>
      <AdminPanelFooter
        onButtonClick={handleSubmit}
        buttonText={createChannelType === 'team'
          ? 'Create Channel'
          : 'Create Message Group'}
      />
    </div>
  );
};
