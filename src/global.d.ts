import React from "react";
import { SiteConfig } from "./hooks/useWebConfigModel";
import { Conversation } from "./components/conversation/Conversation";

export type ChatListKey = 'chatId' | 'title' | 'lastUpdateTime' | 'systemMessage' | 'parentId' | 'model';
export type Model = 'gpt-3.5-turbo' | 'gpt-4';

export interface Config {
  apiKey: string;
  apiHost: string;
  model: string;
  temperature: number; // 输出更加随机 较高的值会使输出更加随机 0 - 2
  presence_penalty: number; // 不轻易改变对话主题 越高越容易改变话题 -2.0 - 2.0
  frequency_penalty: number; // 减少重复已提及的内容 越高重复度越低 -2.0 - 2.0
  stream: boolean; // 流式传输
}

export interface MultiConfig {
  'gpt-3.5-turbo': Config;
  'gpt-4': Config;
}

export interface ChatList {
  chatId: string;
  data: Conversation[];
  title?: string;
  lastUpdateTime?: string;
  systemMessage?: string[];
  parentId?: string;
  model?: Model;
}

export interface ChatStoreProps {
  config: MultiConfig;
  chatList: ChatList[];
  setChatList: React.Dispatch<React.SetStateAction<ChatList[]>>;
  handleConfigChange: (config: MultiConfig) => void;
  handleChange: (chatId: string, data: Conversation[], forceUpdate?: boolean) => void;
  handleDelete: (chatId: string) => void;
  handleChatValueChange: (chatId: string, key: ChatListKey, value: any) => void;
  handleDeleteAll: () => void;
  handleNewChat: (chatProps?: NewChatProps) => void;
}

export interface Messages {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

export interface NewChatProps {
  data?: Conversation[];
  parentId?: string;
  systemMessage?: string[];
  model?: Model;
}