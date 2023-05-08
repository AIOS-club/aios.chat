import React, { Suspense, lazy } from 'react';

const PromptStoreComponent = lazy(async () => import('./PromptStore'));

const PromptStore: React.FC = function PromptStore() {
  return (
    <Suspense fallback={<span>...</span>}>
      <PromptStoreComponent />
    </Suspense>
  );
};

export default PromptStore;
