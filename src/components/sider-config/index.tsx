import React, { Suspense } from 'react';

const SiderConfigComponent = React.lazy(async () => import('./SiderConfig'));

const SiderConfig: React.FC = function SiderConfig() {
  return (
    <Suspense fallback={<span>...</span>}>
      <SiderConfigComponent />
    </Suspense>
  );
};

export default SiderConfig;
