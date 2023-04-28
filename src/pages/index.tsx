import React, { useCallback, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { IconPlus } from '@douyinfe/semi-icons';
import { ChatStoreProps, ChatList, ChatListKey, Config } from '@/global';
import { Conversation } from '@/components/conversation/ConversationProps';
import { randomBrightColor } from '@/utils';
import Header from '@/components/header';
import ProjectSourceInfo from '@/components/project-source-info';
import Dock from '@/components/dock';
import DockCard from '@/components/dock-card';
import Chat from '@/components/chat';
import ChatIcon from '@/components/chat-icon';
import LaunchPad from '@/components/launch-pad';
import useIsMobile from '@/hooks/useIsMobile';
import useDockCount from '@/hooks/useDockCount';

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

  const [displayDock, setDisplayDock] = useState<boolean>(true);
  const [openLaunch, setOpenLaunch] = useState<boolean>(false);

  const isMobile = useIsMobile();

  const dockCount = useDockCount();

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
    setDisplayDock(true);
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
    setDisplayDock,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
    handleChatValueChange,
  }), [chatList, config, handleDeleteAll, handleNewChat]);

  const displayChatList = chatList.slice(0, dockCount);
  const hiddenChatList = chatList.slice(dockCount, chatList.length);
  const currentChat = chatList.find((chat) => chat.chatId === query.get('chatId'));

  return (
    <Store.Provider value={value}>
      <div className="overflow-hidden w-full h-full flex flex-col">
        <Header />
        <div className="overflow-hidden relative grow dark:bg-gray-900">
          <ProjectSourceInfo />
          {displayChatList.length > 0 && !isMobile && (
            <Dock key={`${chatList[0]?.chatId}${chatList.length}`} display={displayDock}>
              {displayChatList.map((chat) => (
                <DockCard key={chat.chatId} checked={chat.chatId === query.get('chatId')} onClick={() => navigate(`?chatId=${chat.chatId}`)}>
                  <ChatIcon chat={chat} />
                </DockCard>
              ))}
              <DockCard onClick={() => setOpenLaunch(true)} checked={hiddenChatList.some((chat) => chat.chatId === query.get('chatId'))}>
                <div id="launch" className="w-full h-full flex flex-wrap justify-center items-center p-[2px]">
                  {chatList.slice(0, 9).map((chat) => (
                    <div
                      key={chat.chatId}
                      className="w-1/5 h-1/5 m-[2px] rounded-sm"
                      style={{ background: randomBrightColor(chat.chatId) }}
                    />
                  ))}
                </div>
              </DockCard>
              <DockCard onClick={handleNewChat}>
                <IconPlus className="w-full h-full flex items-center justify-center" size="large" />
              </DockCard>
            </Dock>
          )}
          {currentChat && (
            <div className="w-full h-full absolute top-0 left-0 z-10 bg-transparent flex items-center justify-center">
              <Chat key={currentChat.chatId} chat={currentChat} />
            </div>
          )}
        </div>
      </div>
      <LaunchPad
        currentChat={currentChat}
        chatList={chatList}
        open={openLaunch}
        setOpen={setOpenLaunch}
        onDeleteItem={handleDelete}
        onClickItem={(chat) => {
          // 启动台选中的会话默认放到第一个？
          if (chat) {
            navigate(`?chatId=${chat?.chatId}`);
            setChatList((pre) => {
              const curChatIndex = pre.findIndex((p) => p.chatId === chat?.chatId);
              pre.splice(curChatIndex, 1);
              if (chat) pre.unshift(chat);
              return pre;
            });
          }
        }}
      />
    </Store.Provider>
  );
}

export default App;
