import React, { useState } from 'react';
import { Button, Form } from '@douyinfe/semi-ui';
import { PromptStoreList, PromptItemProps } from './PromptStoreProps';

const PromptItem: React.FC<PromptItemProps> = function PromptItem(props) {
  const { values, onConfirm } = props;

  const [initValues, setInitValues] = useState<PromptStoreList | undefined>(values);

  return (
    <Form initValues={initValues} onValueChange={(value) => setInitValues({ ...value })}>
      <Form.Input field="title" />
      <Form.TextArea field="content" />
      <Button
        theme="solid"
        type="primary"
        className="my-6 w-full"
        disabled={!initValues?.title || !initValues?.content}
        onClick={() => onConfirm(!!values, initValues)}
      >
        Confirm
      </Button>
    </Form>
  );
};

export default PromptItem;
