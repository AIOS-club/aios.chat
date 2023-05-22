import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Layout, SideSheet } from '@douyinfe/semi-ui';
import Chat from '@/components/chat';
import ChatTree from '@/components/chat-tree';
import ChatConfig from '@/components/chat-config';

import useChatList from '@/hooks/useChatList';

function App () {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const { chatList, handleChatValueChange, handleNewChat } = useChatList();

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const firstChatId = chatList[0]?.chatId;
    if (!query.get('chatId') && firstChatId) {
      navigate(`?chatId=${firstChatId}`);
    }
  }, [chatList, navigate, query]);

  const currentChat = chatList.find((chat) => chat.chatId === query.get('chatId'));
  const parentChat = chatList.find((chat) => chat.chatId === currentChat?.parentId);

  return (
    <Layout className="">
      <Layout.Sider className="w-[250px] max-md:hidden flex-shrink-0">
        <ChatTree />
      </Layout.Sider>
      <Layout.Content className="h-full">
        {currentChat ? <Chat key={currentChat.chatId} chat={currentChat} onOpenConfig={() => setVisible(true)} /> : (
          <div className="h-full w-full flex justify-center items-center">
            <Button type="tertiary" className="text-[20px]" onClick={() => handleNewChat()}>
              Click here to start a new chat
            </Button>
          </div>
        )}
      </Layout.Content>
      {currentChat && (
        <SideSheet
          closable
          style={{ maxWidth: '80%' }}
          bodyStyle={{ marginBottom: '20px' }}
          title="Chat Setting"
          visible={visible}
          onCancel={() => setVisible(false)}
          getPopupContainer={() => document.querySelector('.layout-root') as HTMLElement}
        >
          <ChatConfig
            key={currentChat.chatId}
            chat={currentChat}
            parentChat={parentChat}
            onConfirm={handleChatValueChange}
            onClose={() => setVisible(false)}
          />
        </SideSheet>
      )}
    </Layout>
  );
}

export default App;
