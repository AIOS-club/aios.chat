import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Button, Layout, SideSheet } from '@douyinfe/semi-ui';
import { ChatStoreProps, ChatList, ChatListKey, Config } from '@/global';
import { Conversation } from '@/components/conversation/ConversationProps';
import Header from '@/components/header';
import Chat from '@/components/chat';
import ChatTree from '@/components/chat-tree';
import ChatConfig from '@/components/chat-config';
import SiderConfig from '@/components/sider-config';
import { getDefaultSystemMessage } from '@/utils';

export const Store = React.createContext<ChatStoreProps>({} as any);

function App () {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const [chatList, setChatList] = useState<ChatList[]>(() => {
    if (localStorage?.getItem('chatList')) {
      const data = JSON.parse(localStorage.getItem('chatList') || '[]');
      return data;
    }
    return [{ chatId: uuid(), data: [], systemMessage: getDefaultSystemMessage() }];
  });

  const [config, setConfig] = useState<Config>(() => {
    if (localStorage?.getItem('config')) {
      return JSON.parse(localStorage.getItem('config') || '{}');
    }
    return {
      apiHost: import.meta.env.VITE_API_HOST,
      apiKey: '',
      stream: true,
      temperature: 0.8,
      presence_penalty: -1.0,
      frequency_penalty: 1.0,
      model: 'gpt-3.5-turbo',
    };
  });

  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const firstChatId = chatList[0]?.chatId;
    if (!query.get('chatId') && firstChatId) {
      navigate(`?chatId=${firstChatId}`);
    }
  }, [chatList, navigate, query]);

  const handleConfigChange = (_config: Config) => {
    if (_config && typeof _config === 'object') {
      const data = { ..._config };
      setConfig(data);
      localStorage?.setItem('config', JSON.stringify(data));
    }
  };

  const handleChange = (chatId: string, data: Conversation[], forceUpdate: boolean = false) => {
    setChatList((pre) => {
      const cacheChatList = [...pre];
      const changeChat = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat && Array.isArray(data)) {
        changeChat.data = [...data];
      } else if (forceUpdate) {
        cacheChatList.unshift({ chatId, data });
      }
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleChatValueChange = (chatId: string, key: ChatListKey, value: any) => {
    if (!key) return;
    setChatList((pre) => {
      const cacheChatList: ChatList[] = [...pre];
      const changeChat: any = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat) {
        changeChat[key] = value;
      }
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleDelete = (chatId: string) => {
    setChatList((pre) => {
      const cacheChatList = [...pre];
      const delChatIndex = cacheChatList.findIndex((chat) => chat.chatId === chatId);
      cacheChatList.splice(delChatIndex, 1);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleDeleteAll = useCallback(() => {
    setChatList([]);
    localStorage?.removeItem('chatList');
  }, []);

  const handleNewChat = useCallback((data?: Conversation[], systemMessage?: string[], parentId?: string) => {
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: data || [], systemMessage: systemMessage || getDefaultSystemMessage() };
    if (parentId) Object.assign(newChat, { parentId });
    navigate(`?chatId=${curChatId}`);
    setChatList((pre) => {
      const cacheChatList = [...pre];
      cacheChatList.unshift(newChat);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  }, [navigate]);

  const value = useMemo(() => ({
    chatList,
    config,
    handleConfigChange,
    setChatList,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
    handleChatValueChange,
  }), [chatList, config, handleDeleteAll, handleNewChat]);

  const currentChat = chatList.find((chat) => chat.chatId === query.get('chatId'));

  return (
    <Store.Provider value={value}>
      <Layout className="overflow-hidden w-full h-full md:items-center md:justify-center max-md:flex-col">
        <Layout.Header className="md:hidden">
          <Header />
        </Layout.Header>
        <Layout
          className="relative w-[95%] h-[95%] max-md:w-full max-md:h-[calc(100%-3rem)] flex-none md:rounded-xl overflow-hidden layout-root"
          style={{ border: '1px solid var(--semi-color-border)', maxWidth: '1920px', maxHeight: '1080px' }}
        >
          <div className="w-[50px] flex-shrink-0 max-md:hidden">
            <SiderConfig />
          </div>
          <Layout.Sider className="w-[250px] max-md:hidden flex-shrink-0">
            <ChatTree />
          </Layout.Sider>
          <Layout.Content className="h-full">
            {currentChat ? <Chat key={currentChat.chatId} chat={currentChat} onOpenConfig={() => setVisible(true)} /> : (
              <div className="h-full w-full flex justify-center items-center">
                <Button type="tertiary" className="text-[20px]" onClick={() => handleNewChat}>
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
              <ChatConfig key={currentChat.chatId} chat={currentChat} onConfirm={handleChatValueChange} />
            </SideSheet>
          )}
        </Layout>
      </Layout>
    </Store.Provider>
  );
}

export default App;
