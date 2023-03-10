import { ChangeEventHandler } from 'react';
import { ValidationError } from './ValidationError';

type ChannelNameInputProps = {
  name: string;
  error: string | null;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

export const ChannelNameInputField = ({ name = '', error, placeholder = 'channel-name', onChange }: ChannelNameInputProps) => {

  return (
    <div className='channel-name-input-field'>
      <h2><span>Name</span><ValidationError errorMessage={error} /></h2>
      <input onChange={onChange} placeholder={placeholder} type='text' value={name} />
    </div>
  );
};