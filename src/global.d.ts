import React from "react";
import { SiteConfig } from "./hooks/useWebConfigModel";
import { Conversation } from "./components/conversation/Conversation";
import { IconProps } from "@/components/icon-picker/IconPicker";

export type ChatListKey = 'chatId' | 'title' | 'style' | 'titleBlock' | 'icon' | 'otherProps';

export interface ChatList{
  chatId: string;
  data: Conversation[];
  title?: string;
  style?: React.CSSProperties;
  titleBlock?: boolean;
  icon?: IconProps;
  otherProps?: Record<string, any>;
}

export interface ChatStoreProps {
  apiKey: string;
  chatList: ChatList[];
  setChatList: React.Dispatch<React.SetStateAction<ChatList[]>>;
  setCurrentChat: React.Dispatch<React.SetStateAction<ChatList | undefined>>;
  setDisplayDock: React.Dispatch<React.SetStateAction<boolean>>;
  handleApiKeyChange: (key: string) => void;
  handleChange: (chatId: string, data: Conversation[], forceUpdate?: boolean) => void;
  handleDelete: (chatId: string) => void;
  handleChatValueChange?: (chatId: string, key: ChatListKey, value: any) => void;
  handleDeleteAll: () => void;
  handleNewChat: () => void;
}

export interface Messages {
  role: 'assistant' | 'user' | 'system';
  content: string;
}