import { useCallback, useRef } from 'react';
import { Modal, Toast } from '@douyinfe/semi-ui';
import { IconSetting } from '@douyinfe/semi-icons';
import ConfigSetting from './index';
import useChatList from '@/hooks/useChatList';

function useConfigSetting() {
  const { config, handleConfigChange } = useChatList();

  const configRef = useRef<any>();

  const open = useCallback(() => {
    const preConfig = { ...(config || {}) };
    configRef.current = Modal.info({
      header: (
        <div className="py-6 font-semibold flex items-center">
          <IconSetting className="mr-2" />
          Setting
        </div>
      ),
      style: { top: '100px', maxWidth: '100%' },
      bodyStyle: { marginLeft: 0 },
      content: <ConfigSetting handleConfigChange={handleConfigChange} config={config} />,
      okText: 'Save',
      cancelText: 'Cancel',
      onOk: () => {
        Toast.success('Save successful');
        configRef.current?.destroy();
      },
      onCancel: () => {
        handleConfigChange(preConfig);
        configRef.current?.destroy();
      }
    });
  }, [config, handleConfigChange]);

  return open;
}

export default useConfigSetting;
