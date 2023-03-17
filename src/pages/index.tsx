import React, { ReactElement, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { ChatStoreProps, ChatList } from '@/global.d';
import { Conversation } from '@/components/conversation/Conversation.d';
import SideBar, { HeaderBar } from '@/components/sidebar';
import Chat from '@/components/chat';

export const Store = React.createContext<ChatStoreProps>({} as any);

function App (): ReactElement {
  const navigate = useNavigate();

  const [chatList, setChatList] = useState<ChatList[]>(() => {
    if (localStorage?.getItem('chatList')) {
      const data = JSON.parse(localStorage.getItem('chatList') || '[]');
      return data;
    }
    return [];
  });

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

  const handleTitleChange = (chatId: string, title: string) => {
    if (!title) return;
    setChatList((pre) => {
      const cacheChatList = [...pre];
      const changeChat = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat) {
        changeChat.title = title;
      }
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
  };

  const handleTitleBlock = (chatId: string) => {
    setChatList((pre) => {
      const cacheChatList = [...pre];
      const changeChat = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat) {
        changeChat.titleBlock = true;
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
    navigate('/');
  };

  const handleDeleteAll = () => {
    setChatList([]);
    localStorage?.removeItem('chatList');
    navigate('/');
  };

  const handleNewChat = () => {
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: [] };
    setChatList((pre) => {
      const cacheChatList = [...pre];
      cacheChatList.unshift(newChat);
      localStorage?.setItem('chatList', JSON.stringify(cacheChatList));
      return cacheChatList;
    });
    navigate(`/?chatId=${curChatId}`);
  };

  const value = {
    chatList,
    setChatList,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
    handleTitleChange,
    handleTitleBlock,
  };

  return (
    <Store.Provider value={value}>
      <div className="overflow-hidden w-full h-full relative">
        <div className="flex h-full flex-1 flex-col md:pl-[260px]">
          <HeaderBar onNewChat={handleNewChat} />
          <Chat />
        </div>
        <SideBar onNewChat={handleNewChat} />
      </div>
    </Store.Provider>
  );
}

export default App;
