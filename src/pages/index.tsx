import React, { useMemo, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { ChatStoreProps, ChatList, ChatListKey, Config } from '@/global';
import { Conversation } from '@/components/conversation/Conversation';
import Header from '@/components/header';
import ProjectSourceInfo from '@/components/project-source-info';
import Dock from '@/components/dock';
import DockCard from '@/components/dock-card';
import Chat from '@/components/chat';
import ChatIcon from '@/components/chat-icon';
import useIsMobile from '@/hooks/useIsMobile';

export const Store = React.createContext<ChatStoreProps>({} as any);

function App () {
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
      apiKey: '', stream: true, temperature: 0.8, presence_penalty: -1.0, frequency_penalty: 1.0, model: 'gpt-3.5-turbo'
    };
  });

  const [currentChat, setCurrentChat] = useState<ChatList | undefined>(() => (chatList && chatList.length > 0 ? chatList[0] : { chatId: uuid(), data: [] }));
  const [displayDock, setDisplayDock] = useState<boolean>(true);

  const isMobile = useIsMobile();

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

  const handleDelete = useCallback((chatId: string) => {
    setChatList((pre) => {
      const cacheChatList = [...pre];
      const delChatIndex = cacheChatList.findIndex((chat) => chat.chatId === chatId);
      cacheChatList.splice(delChatIndex, 1);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  }, []);

  const handleDeleteAll = useCallback(() => {
    setChatList([]);
    setCurrentChat(undefined);
    localStorage?.removeItem('chatList');
  }, []);

  const handleNewChat = () => {
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: [] };
    setCurrentChat(newChat);
    setDisplayDock(true);
    setChatList((pre) => {
      const cacheChatList = [...pre];
      cacheChatList.unshift(newChat);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleOpenChat = (chat: ChatList, _: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    setCurrentChat(chat);
  };

  const value = useMemo(() => ({
    chatList,
    config,
    currentChat,
    handleConfigChange,
    setChatList,
    setCurrentChat,
    setDisplayDock,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
    handleChatValueChange,
  }), [chatList, config, currentChat, handleDelete, handleDeleteAll]);

  return (
    <Store.Provider value={value}>
      <div className="overflow-hidden w-full h-full flex flex-col">
        <Header />
        <div className="overflow-hidden relative grow dark:bg-gray-900">
          <ProjectSourceInfo />
          {chatList.length > 0 && !isMobile && (
            <Dock key={chatList.length} display={displayDock}>
              {chatList.map((chat) => (
                <DockCard key={chat.chatId} onClick={(event) => handleOpenChat(chat, event)}>
                  <ChatIcon chat={chat} />
                </DockCard>
              ))}
            </Dock>
          )}
          {currentChat && (
            <div className="w-full h-full absolute top-0 left-0 z-10 bg-transparent flex items-center justify-center">
              <Chat key={currentChat.chatId} chat={currentChat} />
            </div>
          )}
        </div>
      </div>
    </Store.Provider>
  );
}

export default App;
