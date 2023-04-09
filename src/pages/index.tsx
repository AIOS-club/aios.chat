import React, { useMemo, useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { ChatStoreProps, ChatList, ChatListKey } from '@/global.d';
import { Conversation } from '@/components/conversation/Conversation.d';
import Header from '@/components/header';
import ProjectSourceInfo from '@/components/project-source-info';
import Dock from '@/components/dock';
import DockCard from '@/components/dock-card';
import Chat from '@/components/chat';
import SideBar from '@/components/sidebar';

export const Store = React.createContext<ChatStoreProps>({} as any);

function App () {
  const [chatList, setChatList] = useState<ChatList[]>(() => {
    if (localStorage?.getItem('chatList')) {
      const data = JSON.parse(localStorage.getItem('chatList') || '[]');
      return data;
    }
    return [];
  });

  const [apiKey, setApiKey] = useState<string>(() => localStorage?.getItem('API_KEY') || '');

  const [currentChat, setCurrentChat] = useState<ChatList>();

  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage?.setItem('API_KEY', key);
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
    localStorage?.removeItem('chatList');
  }, []);

  const handleNewChat = () => {
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: [] };
    setCurrentChat(newChat);
    setChatList((pre) => {
      const cacheChatList = [...pre];
      cacheChatList.unshift(newChat);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleOpenChat = (chat: ChatList) => {
    setCurrentChat(chat);
  };

  const value = useMemo(() => ({
    chatList,
    apiKey,
    handleApiKeyChange,
    setChatList,
    setCurrentChat,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
  }), [chatList, apiKey, handleDelete, handleDeleteAll]);

  return (
    <Store.Provider value={value}>
      <div className="overflow-hidden w-full h-full relative dark:bg-gray-900">
        <Header />
        <ProjectSourceInfo />
        {/* <HeaderBar onNewChat={handleNewChat} /> */}
        {chatList.length > 0 && (
          <Dock key={chatList.length}>
            {chatList.map((chat) => (
              <DockCard key={chat.chatId} onClick={() => handleOpenChat(chat)}>hello</DockCard>
            ))}
          </Dock>
        )}
        {currentChat && (
          <Chat
            key={currentChat.chatId}
            data={currentChat.data}
            chatId={currentChat.chatId}
            title={currentChat.title}
          />
        )}
        {/* <SideBar onNewChat={handleNewChat} /> */}
      </div>
    </Store.Provider>
  );
}

export default App;
