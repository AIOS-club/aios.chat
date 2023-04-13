import React, { useCallback, useState } from 'react';
import { Form } from '@douyinfe/semi-ui';
import { ConfigSettingProps } from './ConfigSetting';
import { Config } from '@/global';

const ConfigSetting: React.FC<ConfigSettingProps> = function ConfigSetting(props) {
  const { handleConfigChange, config } = props;

  const handleValuesChange = useCallback((values: Config) => {
    handleConfigChange(values);
  }, [handleConfigChange]);

  return (
    <Form labelPosition="left" onValueChange={handleValuesChange}>
      <Form.Select field="model" initValue={config.model || 'gpt-3.5-turbo'} disabled />
      <Form.Input field="apiKey" initValue={config.apiKey} />
      <Form.Slider
        field="temperature"
        initValue={config.temperature ?? 0.8}
        min={0}
        max={2}
        step={0.1}
        marks={{ 0: '0', 1: '1', 2: '2' }}
      />
      <Form.Slider
        field="presence_penalty"
        initValue={config.presence_penalty ?? -1.0}
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
        min={-2}
        max={2}
        step={0.1}
        marks={{
          '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2' 
        }}
      />
      <Form.Switch field="stream" initValue={config.stream || true} disabled />
    </Form>
  );
};

export default ConfigSetting;
