import { CloseAdminPanelButton } from './CloseAdminPanelButton';

type AdminPanelHeaderProps = {
  onClose: () => void;
  title: string;
}

export const AdminPanelHeader = ({onClose, title}: AdminPanelHeaderProps) => (
  <div className='admin-panel__form-header'>
    <div className='workspace-header__title workspace-header__block'>{title}</div>
    <CloseAdminPanelButton onClick={onClose} />
  </div>
)