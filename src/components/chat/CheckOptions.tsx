import React from 'react';
import {
  IconClose, IconDelete, IconList, IconPlus, IconShareStroked 
} from '@douyinfe/semi-icons';
import { Button, Checkbox, Dropdown, Toast } from '@douyinfe/semi-ui';
import { CheckboxEvent } from '@douyinfe/semi-ui/lib/es/checkbox';
import { OptionButtonProps, CheckOptionsProps } from './Chat';

const OptionButton: React.FC<OptionButtonProps> = function OptionButton(props) {
  const { text, onClick, icon, type } = props;
  return (
    <div className="flex flex-col items-center mx-6 cursor-pointer" onClick={onClick}>
      <Button className="w-[40px] h-[40px] max-md:w-[30px] max-md:h-[30px]" type={type || 'secondary'} icon={icon} />
      <span className="break-keep whitespace-nowrap">{text}</span>
    </div>
  );
};

const CheckOptions: React.FC<CheckOptionsProps> = function CheckOptions(props) {
  const {
    chat, data, checkList, onCheckListChange, onClose, handleNewChat 
  } = props;

  const indeterminate = checkList.length > 0 && checkList.length !== data.length;
  const checked = checkList.length === data.length;

  const handleCreateChat = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    if (checkList.length === 0) {
      Toast.warning('Please select at least one option.');
    } else {
      const cacheCheckList = [...checkList].sort((conversation1, conversation2) => {
        const index1 = data.findIndex((conversation) => conversation.key === conversation1.key);
        const index2 = data.findIndex((conversation) => conversation.key === conversation2.key);
        return index1 - index2;
      });
      handleNewChat({ data: cacheCheckList, systemMessage: chat.systemMessage, parentId: chat.chatId });
      onCheckListChange([]);
    }
  };

  const handleDelete = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    Toast.info('The feature is still under development.');
  };

  const handleShare = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    Toast.info('The feature is still under development.');
  };

  const handleChange = (e: CheckboxEvent) => {
    e.stopPropagation();
    const check = e.target.checked;
    onCheckListChange(check ? [...data] : []);
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    onCheckListChange([]);
    onClose(false);
  };

  const renderContent = () => (
    <Dropdown.Menu>
      <Dropdown.Item onClick={handleCreateChat} style={{ color: 'var(--semi-color-secondary)' }} icon={<IconPlus />}>
        New Chat
      </Dropdown.Item>
      <Dropdown.Item onClick={handleDelete} style={{ color: 'var(--semi-color-danger)' }} icon={<IconDelete />}>
        Delete
      </Dropdown.Item>
      <Dropdown.Item onClick={handleShare} style={{ color: 'var(--semi-color-tertiary)' }} icon={<IconShareStroked />}>
        Share
      </Dropdown.Item>
    </Dropdown.Menu>
  );

  return (
    <div
      className="w-full min-h-[80px] p-3 bg-[#f0f1f3] dark:bg-[#191919] flex justify-evenly items-center"
      style={{ borderTop: '1px solid var(--semi-color-border)' }}
    >
      <Checkbox checked={checked} indeterminate={indeterminate} onChange={handleChange}>
        Select All
      </Checkbox>
      <div className="flex max-[408px]:hidden">
        <OptionButton type="secondary" text="New Chat" icon={<IconPlus />} onClick={handleCreateChat} />
        <OptionButton type="danger" text="Delete" icon={<IconDelete />} onClick={handleDelete} />
        <OptionButton type="tertiary" text="Share" icon={<IconShareStroked />} onClick={handleShare} />
      </div>
      <Dropdown clickToHide stopPropagation trigger="click" content={renderContent}>
        <div className="hidden max-[408px]:block">
          <Button type="tertiary" icon={<IconList />}>Options</Button>
        </div>
      </Dropdown>
      <Button type="tertiary" icon={<IconClose />} onClick={handleClose} />
    </div>
  );
};

export default CheckOptions;
