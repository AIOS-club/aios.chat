import React, { Suspense } from 'react';
import { GeneralConfigProps } from './GeneralConfigProps';

const GeneralConfigComponent = React.lazy(async () => import('./GeneralConfig').catch(() => ({ default: () => <div>failed</div> })));

const GeneralConfig: React.FC<GeneralConfigProps> = function GeneralConfig(props) {
  const { chatList, onDelete } = props;
  return (
    <Suspense fallback={<span>...</span>}>
      <GeneralConfigComponent chatList={chatList} onDelete={onDelete} />
    </Suspense>
  );
};

export default GeneralConfig;
