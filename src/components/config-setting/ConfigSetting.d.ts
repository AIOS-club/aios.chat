import { ChatList, Config, Model, MultiConfig } from '@/global';

export interface ConfigSettingProps {
  handleConfigChange: (config: MultiConfig) => void;
  handleDeleteAll: () => void;
  config: MultiConfig;
  tips?: string;
  model?: Model;
  chatList: ChatList[];
}
