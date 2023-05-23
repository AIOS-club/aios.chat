import { Suspense, useEffect } from 'react';
import { useNavigate, useRoutes } from 'react-router-dom';
import { Layout } from '@douyinfe/semi-ui';
import { IconLoading } from '@douyinfe/semi-icons';
import routes from 'virtual:generated-pages-react';
import classNames from 'classnames';
import ChatStore from '@/store/ChatStore';
import SiderConfig from '@/components/sider-config';
import Header from '@/components/header';

export default function App () {
  const navigate = useNavigate();

  useEffect(() => {
    const pathList: string[] = [];
    routes.forEach((route) => route.path && pathList.push(`/${route.path}`));
    const path = window.location.pathname;
    if (!pathList.includes(path)) {
      navigate('/chat');
    }
  }, [navigate]);

  return (
    <Suspense
      fallback={(
        <div className="h-full width-full flex items-center justify-center">
          <IconLoading size="extra-large" className="animate-spin" />
        </div>
      )}
    >
      <ChatStore>
        <Layout
          className={classNames(
            'w-[95%] h-[95%] layout-root relative', 
            'overflow-hidden flex-row flex-none rounded-lg',
            'max-md:flex-col max-md:w-full max-md:h-full max-md:rounded-none',
            'border-[1px] border-[var(--semi-color-border)] max-md:border-none'
          )}
        >
          <Layout.Header className="md:hidden">
            <Header />
          </Layout.Header>
          <Layout.Sider className="w-[50px] h-full flex-shrink-0 max-md:hidden">
            <SiderConfig />
          </Layout.Sider>
          {useRoutes(routes)}
        </Layout>
      </ChatStore>
    </Suspense>
  );
}
