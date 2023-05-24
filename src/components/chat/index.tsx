import React, { useState, useMemo, useRef, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Icon, Toast } from '@douyinfe/semi-ui';
import axios, { AxiosError } from 'axios';
import classNames from 'classnames';
import { IconArrowDown } from '@douyinfe/semi-icons';
import ProjectSourceInfo from '@/components/project-source-info';
import { Conversation } from '@/components/conversation/ConversationProps';
import useConfigSetting from '@/components/config-setting/useConfigSetting';
import ConversationList from '@/components/conversation';
import AutoTextArea from '@/components/auto-textarea';
import useChatList from '@/hooks/useChatList';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import {
  getCachePrompt, parseMarkdown, parseStreamText, getSystemMessages, getCurrentDate 
} from '@/utils';
import { API_HOST_LIST, ONLY_TEXT } from '@/utils/env';
import Refresh from '@/assets/svg/refresh.svg';
import Stop from '@/assets/svg/stop.svg';
import { Config } from '@/global';
import CheckOptions from './CheckOptions';
import { ChatProps } from './Chat';
import styles from './Chat.module.less';
import ChatHeader from './ChatHeader';

const Chat: React.FC<ChatProps> = function Chat(props) {
  const { chat, onOpenConfig } = props;

  const {
    data, chatId: ChatID, title, systemMessage, model 
  } = chat;

  const { config, handleChange, handleChatValueChange, handleNewChat } = useChatList();

  const chatId = useMemo(() => ChatID || uuid(), [ChatID]);

  const [loading, setLoading] = useState<boolean>(false);
  const [conversation, setConversation] = useState<Conversation[]>(data || []);
  const [checkFlag, setCheckFlag] = useState<boolean>(false);
  const [checkList, setCheckList] = useState<Conversation[]>([]);

  const [scrollRef, scrollToBottom] = useScrollToBottom();

  const open = useConfigSetting();

  const abortControllerRef = useRef<AbortController>();
  const arrowDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = scrollRef.current as HTMLDivElement;
    const arrowDownBtn = arrowDownRef.current;

    const handleScroll = () => {
      if (content.scrollTop < content.scrollHeight - content.offsetHeight - 100) {
        arrowDownBtn?.style.setProperty('display', 'flex');
      } else {
        arrowDownBtn?.style.setProperty('display', 'none');
      }
    };

    handleScroll(); // 执行一遍设置初始状态

    content.addEventListener('scroll', handleScroll);
    return () => content.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFetchAnswer = async (v: string, retry: boolean = false) => {
    if (!v) return;
    let curConversation = [] as Conversation[];
    if (retry) {
      curConversation = [...conversation];
      const [lastConversation] = curConversation.slice(-1);
      lastConversation.value = '';
      lastConversation.error = false;
      lastConversation.stop = false;
    } else {
      const conversationId = uuid();
      curConversation = [
        ...conversation,
        {
          character: 'user', value: v, key: uuid(), error: false, conversationId
        },
        {
          character: 'bot', value: '', key: uuid(), error: false, conversationId
        }
      ];
    }
    setConversation(curConversation);
    handleChange(chatId, curConversation, true);
    handleChatValueChange?.(chatId, 'lastUpdateTime', getCurrentDate(true));

    const messages = getSystemMessages(systemMessage).concat(getCachePrompt([...curConversation], v.trimEnd())); // 获取上下文缓存的信息

    abortControllerRef.current = new AbortController();

    setLoading(true);

    const modelConfig: Config = config[model || 'gpt-3.5-turbo'];

    const headers = modelConfig.apiKey ? { Authorization: `Bearer ${modelConfig.apiKey}` } : {};
    const { apiKey, apiHost, ...body } = modelConfig;

    await axios({
      url: apiHost || API_HOST_LIST[model || 'gpt-3.5-turbo'],
      timeout: 300000,
      method: 'POST',
      responseType: 'stream',
      headers: { ...headers },
      data: { messages, ...body },
      signal: abortControllerRef.current.signal,
      onDownloadProgress({ event }) {
        const chunk: string = event.target?.responseText || '';
        const statusCode = event.target?.status;
        if (statusCode === 200) {
          try {
            const parseChunk = ONLY_TEXT === 'true' ? chunk : parseStreamText(chunk);
            setConversation((c) => {
              const pre = [...c];
              const [lastConversation] = pre.slice(-1);
              Object.assign(lastConversation, { value: parseMarkdown(parseChunk), error: false });
              return pre;
            });
            scrollToBottom();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            // abortControllerRef.current?.abort();
          }
        }
      },
    }).catch((error: AxiosError) => {
      const res = error.response?.data;
      const statusCode = error.response?.status;
      const errorObj = res && typeof res === 'string' ? JSON.parse(res) : res;
      const errorMsg = errorObj?.error?.message || errorObj?.message || '';
      // TODO  超过最大tokens限制
      // const errorCode = errorObj?.error?.code || errorObj?.code || '';
      // if (statusCode === 400 && errorCode === 'context_length_exceeded') {
        
      // }
      setConversation((c) => {
        const pre = [...c];
        const [lastConversation] = pre.slice(-1);
        Object.assign(lastConversation, { value: lastConversation.value || errorMsg || 'something is wrong', error: true, stop: true });
        return pre;
      });
      if (statusCode === 401) {
        open(errorMsg, model); // 没key时弹出弹窗
      }
    }).finally(() => {
      setLoading(false);
      abortControllerRef.current = undefined;
      const pre = [...curConversation];
      const [lastConversation] = pre.slice(-1);
      Object.assign(lastConversation, { stop: true });
      handleChange(chatId, pre);
      scrollToBottom();
    });
  };

  const handleRetry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, lastConversation: Conversation) => {
    e.stopPropagation();
    e.preventDefault();
    const { value: lastConversationValue } = lastConversation;
    await handleFetchAnswer(lastConversationValue.trim(), true);
  };

  const handleSelectList = () => {
    if (loading) Toast.warning('Please wait for the current conversation to finish.');
    else setCheckFlag((pre) => !pre);
  };

  const handleCreateChat = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    if (checkList.length === 0) {
      Toast.warning('Please select at least one option.');
    } else {
      const cacheCheckList = [...checkList].sort((conversation1, conversation2) => {
        const index1 = data.findIndex((cn) => cn.key === conversation1.key);
        const index2 = data.findIndex((cn) => cn.key === conversation2.key);
        return index1 - index2;
      });
      handleNewChat({ data: cacheCheckList, systemMessage: chat.systemMessage, parentId: chat.chatId, model });
      setCheckList([]);
    }
  };

  const handleDeleteRecord = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    if (checkList.length === 0) {
      Toast.warning('Please select at least one option.');
    } else {
      const cacheData: Conversation[] = JSON.parse(JSON.stringify(data));
      checkList.forEach((item) => {
        const index = cacheData.findIndex((d) => d.key === item.key);
        if (index >= 0) cacheData.splice(index, 1);
      });
      handleChange(chatId, cacheData);
      setConversation(cacheData);
      Toast.success('Deletion successful');
      setCheckList([]);
      setCheckFlag(false);
    }
  };

  const renderRetryButton = () => {
    const { length } = conversation;
    if (!length) return null;
    const lastUserConversation = conversation[length - 2];
    const lastConversation = conversation[length - 1];
    if (!lastConversation.stop && !loading) return null;

    return (
      <button
        type="button"
        className="btn flex justify-center gap-2 btn-neutral"
        onClick={async (e) => {
          if (loading) abortControllerRef.current?.abort();
          else { await handleRetry(e, lastUserConversation); }
        }}
      >
        <Icon svg={loading ? <Stop /> : <Refresh />} />
        {`${loading ? 'Stop generating' : 'Regenerate response'}`}
      </button>
    );
  };

  return (
    <div className={classNames('shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:text-white', styles.window)}>
      <ChatHeader
        model={model || 'gpt-3.5.turbo'}
        showSelectButton={conversation.length > 0}
        title={title || data[0]?.value}
        onOpenConfig={onOpenConfig}
        onSelectList={handleSelectList}
      />
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full relative">
          <div className="h-full w-full overflow-y-auto" ref={scrollRef}>
            {conversation.length > 0 ? (
              <ConversationList checkList={checkList} onCheckListChange={setCheckList} showCheck={checkFlag} data={conversation} />
            ) : <ProjectSourceInfo />}
          </div>
          <div
            ref={arrowDownRef}
            className={classNames(styles.arrowDown, 'bg-white dark:bg-[#2f2f35]')}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              scrollToBottom();
            }}
          >
            <IconArrowDown />
          </div>
        </div>
      </div>
      <div className={classNames('absolute bottom-0 left-0 w-full bg-vert-light-gradient dark:bg-vert-dark-gradient', { 'md:px-4 max-md:pb-4': !checkFlag })}>
        {!checkFlag ? (
          <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
            <div className="relative flex h-full flex-1 flex-col">
              <div className="w-full flex gap-2 justify-center mb-3">
                {renderRetryButton()}
              </div>
              <AutoTextArea loading={loading} onFetchAnswer={handleFetchAnswer} />
            </div>
          </form>
        ) : (
          <CheckOptions
            chat={chat}
            checkList={checkList}
            data={conversation}
            onCreateNewChat={handleCreateChat}
            onDeleteRecord={handleDeleteRecord}
            onCheckListChange={setCheckList}
            onClose={setCheckFlag}
            handleNewChat={handleNewChat}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
