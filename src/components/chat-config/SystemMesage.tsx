import React, { useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  Button, ButtonGroup, Empty, TextArea, Toast 
} from '@douyinfe/semi-ui';
import {
  IconClose, IconDelete, IconEdit, IconTick, IconPlus 
} from '@douyinfe/semi-icons';

interface SystemMessageProps {
  data: string[];
  onChange: React.Dispatch<React.SetStateAction<string[]>>;
}

interface SystemMessageItemProps {
  id: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onDelete: (id: string) => void;
}

interface SmList {
  id: string;
  value: string;
}

const SystemMessageItem: React.FC<SystemMessageItemProps> = function SystemMessageItem(props) {
  const { value, id, onChange, onDelete } = props;

  const [inputValue, setInputValue] = useState<string>(value);
  const [editFlag, setEditFlag] = useState<boolean>(!value);

  const handleConfirm = useCallback(() => {
    if (!inputValue) {
      Toast.warning('Please fill in some system message');
      return;
    }
    onChange(id, inputValue);
    setEditFlag(false);
  }, [id, inputValue, onChange]);

  const handleCancel = useCallback(() => {
    if (!value) {
      onDelete(id);
      return;
    }
    setInputValue(value);
    setEditFlag(false);
  }, [value, id, onDelete]);

  return (
    <div className="min-h-[50px] border-[var(--semi-color-border)] border-b-[1px] p-2">
      {editFlag ? (
        <TextArea value={inputValue} onChange={setInputValue} autoFocus />
      ) : (
        <div className="text-overflow-l2">{value}</div>
      )}
      <ButtonGroup className="mt-1 justify-end">
        {editFlag ? (
          <>
            <Button type="secondary" icon={<IconTick />} onClick={handleConfirm} />
            <Button type="danger" icon={<IconClose />} onClick={handleCancel} />
          </>
        ) : (
          <>
            <Button type="secondary" icon={<IconEdit />} onClick={() => setEditFlag(true)} />
            <Button type="danger" icon={<IconDelete />} onClick={() => onDelete(id)} />
          </>
        )}
      </ButtonGroup>
    </div>
  );
};

const SystemMessage: React.FC<SystemMessageProps> = function SystemMessage(props) {
  const { data, onChange } = props;

  const [smList, setSmList] = useState<SmList[]>(() => data.map((d) => ({ id: uuid(), value: d })));

  const handleChange = (id: string, value: string) => {
    const cacheData = [...smList];
    const changeData = cacheData.find((d) => d.id === id);
    if (changeData) {
      Object.assign(changeData, { value });
    }
    setSmList(cacheData);
    onChange(cacheData.map((d) => d.value));
  };

  const handleDelete = (id: string) => {
    const cacheData = [...smList];
    const changeDataIndex = cacheData.findIndex((d) => d.id === id);
    if (changeDataIndex >= 0) {
      cacheData.splice(changeDataIndex, 1);
    }
    setSmList(cacheData);
    onChange(cacheData.map((d) => d.value));
  };

  const handleAddOne = () => {
    const newSystemMessage = { id: uuid(), value: '' };
    setSmList((pre) => {
      const cacheData = [...(pre || [])];
      cacheData.push(newSystemMessage);
      return cacheData;
    });
  };

  return (
    <div className="border-[var(--semi-color-border)] border-[1px] rounded-lg">
      {smList.map((d) => (
        <SystemMessageItem
          key={d.id}
          id={d.id}
          value={d.value}
          onChange={handleChange}
          onDelete={handleDelete}
        />
      ))}
      <ButtonGroup className="justify-end my-4">
        <Button className="flex-1" type="tertiary" icon={<IconPlus />} onClick={handleAddOne}>Add</Button>
      </ButtonGroup>
    </div>
  );
};

export default SystemMessage;
