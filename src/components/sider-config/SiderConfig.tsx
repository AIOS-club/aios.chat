import React from 'react';
import { IconGithubLogo, IconSetting } from '@douyinfe/semi-icons';
import { Button, Icon } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import Chat from '@/assets/svg/chat.svg';

const SiderConfig: React.FC = function SiderConfig() {
  const open = useConfigSetting();

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/chat');
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between bg-[#333]">
      <Icon
        className="p-[8px] my-2 cursor-pointer bg-white rounded-full dark:text-black"
        svg={<Chat />}
        onClick={handleClick}
      />
      <div className="w-full flex flex-col items-center">
        <Button
          className="my-2 !text-white"
          type="tertiary"
          icon={<IconGithubLogo size="large" />}
          onClick={() => window.open('https://github.com/AIOS-club/aios.chat')}
        />
        <Button
          className="my-2 !text-white"
          type="tertiary"
          icon={<IconSetting size="large" />}
          onClick={() => open()}
        />
      </div>
    </div>
  );
};

export default SiderConfig;
