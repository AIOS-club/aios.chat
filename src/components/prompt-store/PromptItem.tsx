import React, { useState } from 'react';
import { Button, Form } from '@douyinfe/semi-ui';
import { PromptStoreList, PromptItemProps } from './PromptStoreProps';

const PromptItem: React.FC<PromptItemProps> = function PromptItem(props) {
  const { values, onConfirm } = props;

  const [initValues, setInitValues] = useState<PromptStoreList | undefined>(values);

  return (
    <Form initValues={initValues} onValueChange={(value) => setInitValues({ ...value })}>
      <Form.Input label="Title" field="label" />
      <Form.TextArea label="Content" field="value" />
      <Button
        theme="solid"
        type="primary"
        className="my-6 w-full"
        disabled={!initValues?.label || !initValues?.value}
        onClick={() => onConfirm(!!values, initValues)}
      >
        Confirm
      </Button>
    </Form>
  );
};

export default PromptItem;
