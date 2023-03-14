import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import { IconLoading } from '@douyinfe/semi-icons';
import routes from 'virtual:generated-pages-react';

export default function App () {
  return (
    <>
      <Suspense
        fallback={(
          <div className='h-full width-full flex items-center justify-center'>
            <IconLoading size="extra-large" className='animate-spin' />
          </div>
        )}>
        {useRoutes(routes)}
      </Suspense>
    </>
  );
}
