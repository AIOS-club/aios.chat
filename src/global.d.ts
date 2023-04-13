import React from "react";
import { SiteConfig } from "./hooks/useWebConfigModel";
import { Conversation } from "./components/conversation/Conversation";
import { IconProps } from "@/components/icon-picker/IconPicker";

export type ChatListKey = 'chatId' | 'title' | 'style' | 'titleBlock' | 'icon' | 'otherProps';

export interface Config {
  apiKey: string;
  model: string;
  temperature: number; // 输出更加随机 较高的值会使输出更加随机 0 - 2
  presence_penalty: number; // 不轻易改变对话主题 越高越容易改变话题 -2.0 - 2.0
  frequency_penalty: number; // 减少重复已提及的内容 越高重复度越低 -2.0 - 2.0
  stream: boolean; // 流式传输
}

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
  config: Config;
  chatList: ChatList[];
  setChatList: React.Dispatch<React.SetStateAction<ChatList[]>>;
  setCurrentChat: React.Dispatch<React.SetStateAction<ChatList | undefined>>;
  setDisplayDock: React.Dispatch<React.SetStateAction<boolean>>;
  handleConfigChange: (config: Config) => void;
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