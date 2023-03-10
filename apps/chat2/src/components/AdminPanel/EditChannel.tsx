import { AdminPanelHeader } from './AdminPanelHeader';
import { AdminPanelFooter } from './AdminPanelFooter';
import { ChannelNameInputField } from './ChannelNameInputField';
import { UserList } from './UserList';

import { useWorkspaceController } from '../../context/WorkspaceController';
import { useAdminPanelFormState } from './context/AdminPanelFormContext';

export const EditChannel = () => {
  const { closeAdminPanel } = useWorkspaceController();
  const {name, handleInputChange, handleSubmit, errors} = useAdminPanelFormState()

  return (
    <div className='admin-panel__form'>
      <AdminPanelHeader onClose={closeAdminPanel} title='Edit Channel'/>
      <ChannelNameInputField name={name} error={errors.name} onChange={handleInputChange} />
      <UserList />
      <AdminPanelFooter buttonText='Save Changes' onButtonClick={handleSubmit}/>
    </div>
  );
};
