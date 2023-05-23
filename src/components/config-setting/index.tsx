import React, { useCallback, useState } from 'react';
import { Form, Tabs, Tooltip } from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import PromptStore from '@/components/prompt-store';
import GeneralConfig from '@/components/general-config';
import { Config, Model, MultiConfig } from '@/global';
import { ConfigSettingProps } from './ConfigSetting';

const API_HOST_LIST = {
  'gpt-3.5-turbo': import.meta.env.VITE_API_HOST,
  'gpt-4': import.meta.env.VITE_API_HOST_GPT4
};

const ConfigSetting: React.FC<ConfigSettingProps> = function ConfigSetting(props) {
  const {
    handleConfigChange, config: defaultConfig, tips, chatList, handleDeleteAll 
  } = props;

  const [model, setModel] = useState<Model>('gpt-3.5-turbo');
  const [multiConfig, setMultiConfig] = useState<MultiConfig>(defaultConfig);

  const handleValuesChange = useCallback((values: Config) => {
    const cacheConfig = JSON.parse(JSON.stringify(multiConfig));
    cacheConfig[model] = { ...values, model };
    handleConfigChange(cacheConfig);
    setMultiConfig(cacheConfig);
  }, [handleConfigChange, model, multiConfig]);

  const labelTips = useCallback((content: string) => (
    <Tooltip content={content}><IconHelpCircle className="pt-[2px]" /></Tooltip>
  ), []);

  const config = multiConfig[model] || {};
  const API_HOST = API_HOST_LIST[model] || 'https://api.openai.com/v1/chat/completions';

  return (
    <Tabs>
      <Tabs.TabPane tab="Model Setting" itemKey="0">
        <div className="my-2 text-[#444] dark:text-[#ddd]">
          This tab page is only for setting model parameters.
          If you need to modify the model, you will need to do so on the conversation details page.
        </div>
        <Form labelPosition="left">
          <Form.Select field="model" initValue={model} onChange={(value) => setModel(value as Model)}>
            <Form.Select.Option value="gpt-3.5-turbo">gpt-3.5-turbo</Form.Select.Option>
            <Form.Select.Option value="gpt-4">gpt-4</Form.Select.Option>
          </Form.Select>
        </Form>
        <Form key={model} labelPosition="left" onValueChange={handleValuesChange}>
          <Form.Input field="apiHost" initValue={config.apiHost || API_HOST} showClear />
          {tips ? <div className="text-[#ff0000]">{tips}</div> : null}
          <Form.Input field="apiKey" initValue={config.apiKey} showClear />
          <Form.Slider
            field="temperature"
            initValue={config.temperature ?? 0.8}
            label={{ text: 'temperature', extra: labelTips('A higher value will make the output more random.') }}
            min={0}
            max={2}
            step={0.1}
            marks={{ 0: '0', 1: '1', 2: '2' }}
          />
          <Form.Slider
            field="presence_penalty"
            initValue={config.presence_penalty ?? -1.0}
            label={{ text: 'presence_penalty', extra: labelTips('A higher value will make it easier to shift the conversation topic.') }}
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
            label={{ text: 'frequency_penalty', extra: labelTips('The higher the value, the lower the repetition rate of the output.') }}
            min={-2}
            max={2}
            step={0.1}
            marks={{
              '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
            }}
          />
          <Form.Switch field="stream" initValue={config.stream} />
        </Form>
      </Tabs.TabPane>
      <Tabs.TabPane tab="General" itemKey="1">
        <GeneralConfig chatList={chatList} onDelete={handleDeleteAll} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Prompt Store" itemKey="2">
        <PromptStore />
      </Tabs.TabPane>
    </Tabs>
  );
};

export default ConfigSetting;
