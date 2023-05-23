import React, { Suspense, lazy } from 'react';

const PromptStoreComponent = lazy(async () => import('./PromptStore').catch(() => ({ default: () => <div>failed</div> })));

const PromptStore: React.FC = function PromptStore() {
  return (
    <Suspense fallback={<span>...</span>}>
      <PromptStoreComponent />
    </Suspense>
  );
};

export default PromptStore;
