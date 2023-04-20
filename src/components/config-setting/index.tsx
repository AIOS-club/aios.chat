import React, { useCallback } from 'react';
import { Form, Tooltip } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import { ConfigSettingProps } from './ConfigSetting';
import { Config } from '@/global';

const ConfigSetting: React.FC<ConfigSettingProps> = function ConfigSetting(props) {
  const { handleConfigChange, config } = props;

  const handleValuesChange = useCallback((values: Config) => {
    handleConfigChange(values);
  }, [handleConfigChange]);

  const labelTips = useCallback((content: string) => (
    <Tooltip content={content}><IconHelpCircle className="pt-[2px]" /></Tooltip>
  ), []);

  return (
    <Form labelPosition="left" onValueChange={handleValuesChange}>
      <Form.Select field="model" initValue={config.model || 'gpt-3.5-turbo'} disabled />
      <Form.Input field="apiKey" initValue={config.apiKey} />
      <Form.Slider
        field="temperature"
        initValue={config.temperature ?? 0.8}
        label={{ text: 'temperature', extra: labelTips('较高的值会使输出更加随机') }}
        min={0}
        max={2}
        step={0.1}
        marks={{ 0: '0', 1: '1', 2: '2' }}
      />
      <Form.Slider
        field="presence_penalty"
        initValue={config.presence_penalty ?? -1.0}
        label={{ text: 'presence_penalty', extra: labelTips('较高的值会容易改变对话的主题') }}
        min={-2}
        max={2}
        step={0.1}
        marks={{
          '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2' 
        }}
      />
      <Form.Slider
        field="frequency_penalty"
        initValue={config.frequency_penalty ?? 1.0}
        label={{ text: 'frequency_penalty', extra: labelTips('值越高，输出的重复度越低') }}
        min={-2}
        max={2}
        step={0.1}
        marks={{
          '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2' 
        }}
      />
      <Form.Switch field="stream" initValue={config.stream} />
    </Form>
  );
};

export default ConfigSetting;
