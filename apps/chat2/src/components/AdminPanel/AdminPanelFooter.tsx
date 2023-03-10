import { MouseEventHandler } from 'react';

type AdminPanelFooterProps = {
  buttonText: string;
  onButtonClick: MouseEventHandler<HTMLButtonElement>;
}

export const AdminPanelFooter = ({buttonText, onButtonClick}: AdminPanelFooterProps) => (
  <div className='admin-panel__form-footer' >
    <button onClick={onButtonClick}>{buttonText}</button>
  </div>
)