import React from "react";
import { SiteConfig } from "./hooks/useWebConfigModel";
import { Conversation } from "./components/conversation/Conversation";

export interface ChatList{
  chatId: string;
  data: Conversation[];
  title?: string;
  titleBlock?: boolean;
}

export interface ChatStoreProps {
  apiKey: string;
  chatList: ChatList[];
  setChatList: React.Dispatch<React.SetStateAction<ChatList[]>>;
  handleApiKeyChange: (key: string) => void;
  handleChange: (chatId: string, data: Conversation[], forceUpdate?: boolean) => void;
  handleDelete: (chatId: string) => void;
  handleTitleChange: (chatId: string, title: string) => void;
  handleTitleBlock: (chatId: string) => void;
  handleDeleteAll: () => void;
  handleNewChat: () => void;
}

export interface Messages {
  role: 'assistant' | 'user' | 'system';
  content: string;
}