import React, { Suspense } from 'react';

const HeaderComponent = React.lazy(async () => import('./Header').catch(() => ({ default: () => <div>failed</div> })));

const Header: React.FC = function Header() {
  return (
    <Suspense fallback={<span>...</span>}>
      <HeaderComponent />
    </Suspense>
  );
};

export default Header;
