import React, { useState } from 'react';
import { TextArea, Button, Toast } from '@douyinfe/semi-ui';
import type { ValidateStatus } from '@douyinfe/semi-ui/lib/es/input';
import { v4 as uuid } from 'uuid';
import { ImportFromLocalProps } from './PromptStoreProps';

const ImportFromLocal: React.FC<ImportFromLocalProps> = function ImportFromLocal(props) {
  const { onConfirm } = props;

  const [json, setJson] = useState<string>('');
  const [status, setStatus] = useState<ValidateStatus>('default');

  const handleError = () => {
    setStatus('error');
    Toast.error('Wrong JSON format');
  };

  const formatJSON = (value: Record<string, string> | Array<Record<string, string>>) => {
    // 将key-value的键值对变成label-value
    if (Array.isArray(value)) {
      value.forEach((v) => {
        Object.assign(v, { key: uuid(), label: v.key });
      });
    } else {
      Object.assign(value, { key: uuid(), label: value.key });
    }
    return value;
  };

  const handleClick = () => {
    try {
      const parsedJson = JSON.parse(json);
      if (!Array.isArray(parsedJson) || typeof parsedJson !== 'object') {
        // 不是数组的json或者不是单独的对象json，抛出错误
        handleError();
        return;
      }
      const formatJson = formatJSON(parsedJson);
      onConfirm(formatJson);
    } catch {
      handleError();
    }
  };

  const handleChange = (value: string) => {
    setJson(value);
    setStatus('default');
  };

  return (
    <>
      <TextArea
        value={json}
        onChange={handleChange}
        placeholder="Paste the contents of the JSON file here"
        validateStatus={status}
      />
      <Button
        theme="solid"
        type="primary"
        className="my-6 w-full"
        disabled={!json}
        onClick={handleClick}
      >
        Confirm
      </Button>
    </>
  );
};

export default ImportFromLocal;
