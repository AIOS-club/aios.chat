import React, { useState } from 'react';
import { Input, Icon } from '@douyinfe/semi-ui';
import Key from '@/assets/svg/key.svg';
import { ApiKeyInputProps } from './ApiKeyInput';

const ApiKeyInput: React.FC<ApiKeyInputProps> = function ApiKeyInput(props) {
  const { handleApiKeyChange, localApiKey } = props;

  const [apiKey, setApiKey] = useState<string>(localApiKey);

  return (
    <div className="pb-1">
      <Input
        placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        prefix={<Icon svg={<Key />} />}
        value={apiKey}
        onChange={(value) => {
          const trimValue = value.trim();
          setApiKey(trimValue);
          handleApiKeyChange(trimValue);
        }}
      />
    </div>
  );
};

export default ApiKeyInput;
