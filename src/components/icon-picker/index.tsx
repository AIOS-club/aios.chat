import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Dropdown } from '@douyinfe/semi-ui';
import { IconClose } from '@douyinfe/semi-icons';
import Picker from '@emoji-mart/react';
import Emoji from '@/components/emoji';
import { IconPickerProps, IconProps } from './IconPicker';

const IconCls = 'w-16 h-16 pt-2 rounded border border-gray-200 flex items-center justify-center relative';
const CloseCls = 'absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-slate-50 p-1 rounded-full';

const IconPicker: React.FC<IconPickerProps> = function IconPicker(props) {
  const {
    disabled, icon: propsIcon, emojiId, closeable, onSelect 
  } = props;

  const [icon, setIcon] = useState<IconProps | undefined>(() => {
    if (propsIcon) return propsIcon;
    if (emojiId) return { id: emojiId, };
    return undefined;
  });

  const handleEmojiSelect = useCallback((selectedIcon: IconProps) => {
    setIcon(selectedIcon);
    onSelect?.(selectedIcon);
  }, [onSelect]);

  const handleDelete = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    event.preventDefault();
    setIcon(undefined);
    onSelect?.(undefined);
  }, [onSelect]);

  return (
    <Dropdown
      trigger={disabled ? 'custom' : 'click'}
      visible={disabled ? false : undefined}
      content={<Picker onEmojiSelect={handleEmojiSelect} />}
      position="bottomLeft"
    >
      <div className={classNames(IconCls, { 'cursor-pointer': !disabled })}>
        {closeable && icon?.id && (
          <div className={CloseCls} onClick={handleDelete}>
            <IconClose size="small" />
          </div>
        )}
        {icon?.id ? <Emoji size="2rem" id={icon?.id} shortcodes={icon?.shortcodes} skin={icon?.skin || 1} /> : null}
      </div>
    </Dropdown>
  );
};

export default IconPicker;
