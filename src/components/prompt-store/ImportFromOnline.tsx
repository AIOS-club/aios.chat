import React, { useState } from 'react';
import {
  Input, Button, Card, CardGroup, Divider, ButtonGroup, Toast 
} from '@douyinfe/semi-ui';
import { IconDownload, IconGithubLogo, IconPlusStroked, IconExternalOpenStroked } from '@douyinfe/semi-icons';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import Papa from 'papaparse';
import githubPromptList from '@/assets/json/promptRecommend.json';
import { ImportFromOnlineProps } from './PromptStoreProps';

const ImportFromOnline: React.FC<ImportFromOnlineProps> = function ImportFromOnline(props) {
  const { onConfirm } = props;

  const [url, setUrl] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);

  const formatJson = (data: any) => {
    if (Array.isArray(data)) {
      data.forEach((d) => {
        Object.assign(d, { key: uuid(), label: (d.act || d.key), value: (d.prompt || d.value) });
      });
    } else if (typeof data === 'string') {
      // 尝试解析一下是不是csv
      const jsonData = Papa.parse(data, { header: true }).data;
      if (Array.isArray(jsonData)) {
        jsonData.forEach((d: any) => {
          Object.assign(d, { key: uuid(), label: (d.act || d.key), value: (d.prompt || d.value) });
        });
      }
      return jsonData;
    }
    return data;
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      const json = formatJson(res?.data);
      onConfirm(json);
    } catch {
      Toast.error('Download failed, please check the network or downloaded file format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-4">
      <div className="flex">
        <Input
          className="flex-grow w-0"
          value={url}
          onChange={setUrl}
          placeholder="Fill in the json download address here"
          showClear
        />
        <Button
          className="ml-4 flex-shrink-0"
          theme="solid"
          icon={<IconDownload />}
          disabled={!url}
          loading={loading}
          onClick={handleDownload}
        >
          Download
        </Button>
      </div>
      <Divider margin={20} />
      <CardGroup spacing={20}>
        {githubPromptList.map((data) => (
          <Card
            key={data.origin}
            className="flex-1 max-md:flex-auto"
            title={(
              <Card.Meta
                title={data.title}
                avatar={<IconGithubLogo className="h-full flex items-center" size="large" />}
                description={<div className="my-1">{data.desc}</div>}
              />
            )}
          >
            <div className="mb-6">{data.introduce}</div>
            <ButtonGroup>
              <Button
                className="flex-1"
                type="tertiary"
                icon={<IconExternalOpenStroked size="large" />}
                onClick={() => window.open(data.origin)}
              />
              <Button
                className="flex-1"
                type="tertiary"
                icon={<IconPlusStroked size="large" />}
                onClick={() => setUrl(data.downloadUrl)}
              />
            </ButtonGroup>
          </Card>
        ))}
      </CardGroup>
    </div>
  );
};

export default ImportFromOnline;
