import { ChatList, Config } from '@/global';

export interface ConfigSettingProps {
  handleConfigChange: (config: Config) => void;
  handleDeleteAll: () => void;
  config: Config;
  tips?: string;
  chatList: ChatList[];
}
