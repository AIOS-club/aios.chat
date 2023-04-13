import { Config } from '@/global';

export interface ConfigSettingProps {
  handleConfigChange: (config: Config) => void;
  config: Config;
}
