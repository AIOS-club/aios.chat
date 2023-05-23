import {
  useState, useMemo, useCallback, createContext, useEffect 
} from 'react';
import { v4 as uuid } from 'uuid';
import { useNavigate } from 'react-router-dom';
import {
  ChatStoreProps, ChatList, ChatListKey, MultiConfig, NewChatProps 
} from '@/global';
import { Conversation } from '@/components/conversation/ConversationProps';
import { getDefaultSystemMessage } from '@/utils';

interface ChatStoreReactProps {
  children: React.ReactElement;
}

export const Store = createContext<ChatStoreProps>({} as any);

function ChatStore({ children }: ChatStoreReactProps) {
  const navigate = useNavigate();

  const [chatList, setChatList] = useState<ChatList[]>(() => {
    if (localStorage?.getItem('chatList')) {
      const data = JSON.parse(localStorage.getItem('chatList') || '[]');
      return data;
    }
    return [{ chatId: uuid(), data: [], systemMessage: getDefaultSystemMessage(), model: 'gpt-3.5-turbo' }];
  });

  const [config, setConfig] = useState<MultiConfig>(() => {
    if (localStorage?.getItem('multiConfig')) {
      return JSON.parse(localStorage.getItem('multiConfig') || '{}');
    }
    const defaultConfig = {
      apiKey: '',
      stream: true,
      temperature: 0.8,
      presence_penalty: -1.0,
      frequency_penalty: 1.0,
    };
    return {
      'gpt-3.5-turbo': { ...defaultConfig, apiHost: import.meta.env.VITE_API_HOST, model: 'gpt-3.5-turbo', },
      'gpt-4': { ...defaultConfig, apiHost: import.meta.env.VITE_API_HOST_GPT4, model: 'gpt-4', },
    };
  });

  useEffect(() => {
    // 兼容旧的config数据，主要是apiKey
    const cacheConfig = localStorage?.getItem('config') ? JSON.parse(localStorage.getItem('config') || '{}') : {};
    if (cacheConfig?.apiKey && !cacheConfig?.block) {
      setConfig((pre) => {
        const cachePreConfig = JSON.parse(JSON.stringify(pre));
        Object.assign(cachePreConfig['gpt-3.5-turbo'], { apiKey: cacheConfig.apiKey });
        cacheConfig.block = true;
        localStorage.setItem('config', JSON.stringify(cacheConfig));
        localStorage.setItem('multiConfig', JSON.stringify(cachePreConfig));
        return cachePreConfig;
      });
    }
  }, []);

  const handleConfigChange = (_config: MultiConfig) => {
    if (_config && typeof _config === 'object') {
      const data = JSON.parse(JSON.stringify(_config));
      setConfig(data);
      localStorage?.setItem('multiConfig', JSON.stringify(data));
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

  const handleNewChat = useCallback((newChatProps?: NewChatProps) => {
    const { data, systemMessage, parentId, model = 'gpt-3.5-turbo' } = newChatProps || {};
    const curChatId = uuid();
    const newChat = { chatId: curChatId, data: data || [], systemMessage: systemMessage || getDefaultSystemMessage(), model };
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

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

export default ChatStore;
