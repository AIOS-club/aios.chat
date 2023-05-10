import React, { useCallback, useState } from 'react';
import {
  Button, ButtonGroup, Modal, Popconfirm, Table, Toast 
} from '@douyinfe/semi-ui';
import { IconDelete, IconPlus, IconRedoStroked } from '@douyinfe/semi-icons';
import { v4 as uuid } from 'uuid';
import PromptItem from './PromptItem';
import { PromptStoreList } from './PromptStoreProps';

const PromptStore: React.FC = function PromptStore() {
  const [data, setData] = useState<PromptStoreList[]>(() => {
    if (localStorage?.getItem('PromptStore')) {
      return JSON.parse(localStorage.getItem('PromptStore') || '') || [];
    }
    return undefined;
  });

  const [visible, setVisible] = useState<boolean>(false);

  const [initValues, setInitValues] = useState<PromptStoreList>();

  const handleClear = () => {
    setData([]);
    localStorage?.removeItem('PromptStore');
  };

  const handleDelete = useCallback((index: number) => {
    const cacheData = [...data];
    cacheData.splice(index, 1);
    setData(cacheData);
    localStorage?.setItem('PromptStore', JSON.stringify(cacheData));
  }, [data]);

  const handleClose = () => {
    setVisible(false);
    setInitValues(undefined);
  };

  const handleChange = (record: PromptStoreList) => {
    setInitValues(record);
    setVisible(true);
  };

  const handleConfirm = (changeFlag: boolean, values?: PromptStoreList) => {
    if (values) {
      if (!changeFlag && data?.some((d) => d.label === values.label)) {
        Toast.warning('title repeat');
        return;
      }
      setData((pre) => {
        const cacheData = [...(pre || [])];
        if (changeFlag) {
          const changeData = cacheData.find((d) => d.key === values.key);
          if (changeData) Object.assign(changeData, { ...values });
        } else {
          cacheData.unshift({ ...values, key: uuid() });
        }
        localStorage.setItem('PromptStore', JSON.stringify(cacheData));
        return cacheData;
      });
      handleClose();
    }
  };

  const renderOptions = useCallback((_: any, record: PromptStoreList, index: number) => (
    <ButtonGroup>
      <Button icon={<IconRedoStroked />} type="secondary" onClick={() => handleChange(record)}>Change</Button>
      <Button icon={<IconDelete />} type="danger" onClick={() => handleDelete(index)}>Delete</Button>
    </ButtonGroup>
  ), [handleDelete]);

  const renderText = useCallback((text: any) => <div className="text-overflow-l4">{text}</div>, []);

  return (
    <>
      <ButtonGroup style={{ padding: '0 10px', height: 60, justifyContent: 'flex-end', alignItems: 'center' }}>
        <Button icon={<IconPlus />} type="tertiary" onClick={() => setVisible(true)}>Add</Button>
        <Popconfirm okText="Confirm" cancelText="Cancel" title="Are you sure?" onConfirm={handleClear}>
          <Button icon={<IconDelete />} type="danger">Delete all</Button>
        </Popconfirm>
      </ButtonGroup>
      <Table dataSource={data} pagination={{ formatPageText: false }} empty="No data">
        <Table.Column width="25%" title="Title" dataIndex="label" key="label" render={renderText} />
        <Table.Column width="45%" title="Content" dataIndex="value" key="value" render={renderText} />
        <Table.Column width="30%" title="Options" dataIndex="options" key="Options" render={renderOptions} />
      </Table>
      <Modal
        visible={visible}
        title="Add a prompt"
        footer={null}
        style={{ maxWidth: '100%' }}
        onCancel={handleClose}
      >
        <PromptItem values={initValues} onConfirm={handleConfirm} />
      </Modal>
    </>
  );
};

export default PromptStore;
