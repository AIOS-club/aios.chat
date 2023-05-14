import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { Layout } from '@douyinfe/semi-ui';
import { ChatStoreProps, ChatList, ChatListKey, Config } from '@/global';
import { Conversation } from '@/components/conversation/ConversationProps';
import Header from '@/components/header';
import Chat from '@/components/chat';

export const Store = React.createContext<ChatStoreProps>({} as any);

function App () {
  const navigate = useNavigate();
  const [query] = useSearchParams();

  const [chatList, setChatList] = useState<ChatList[]>(() => {
    if (localStorage?.getItem('chatList')) {
      const data = JSON.parse(localStorage.getItem('chatList') || '[]');
      return data;
    }
    return [{ chatId: uuid(), data: [] }];
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
    navigate('/');
    localStorage?.removeItem('chatList');
  }, [navigate]);

  const handleNewChat = useCallback(() => {
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: [] };
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
      <div className="overflow-hidden w-full h-full flex flex-col">
        <Header />
        <div className="overflow-hidden w-full h-full flex justify-center items-center">
          <Layout
            className="w-4/5 h-4/5 max-md:w-full max-md:h-full flex-none rounded-xl"
            style={{ border: '1px solid var(--semi-color-border)', }}
          >
            {currentChat && (
              <Layout.Content className="h-full">
                <Chat key={currentChat.chatId} chat={currentChat} />
              </Layout.Content>
            )}
          </Layout>
        </div>
      </div>
    </Store.Provider>
  );
}

export default App;
