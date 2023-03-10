import { useCallback, useMemo, useState } from 'react';
import { useChannelStateContext, useChatContext, useMessageInputContext } from 'stream-chat-react';

import { useGiphyInMessageContext } from '../../../context/GiphyInMessageFlagContext';

import { StreamChatType } from '../../../types';

export type MessageInputControlType = 'emoji' | 'bold' | 'italics' | 'code' | 'strike-through';

export const useMessageInputCompositionControls = () => {
  const { client } = useChatContext<StreamChatType>();
  const {
    channel,
  } = useChannelStateContext<StreamChatType>();
  const messageInput = useMessageInputContext<StreamChatType>();
  const { isComposingGiphyMessage, clearGiphyFlagMainInput, setComposeGiphyMessageFlag } = useGiphyInMessageContext();
  const [formatting, setFormatting] = useState<MessageInputControlType | null>(null);

  const placeholder = useMemo(() => {
    let dynamicPart = 'the group';

    if (channel.type === 'team') {
      dynamicPart = `#${channel?.data?.name || channel?.data?.id || 'random'}`;

    }

    const members = Object.values(channel.state.members).filter(
      ({ user }) => user?.id !== client.userID,
    );
    if (!members.length || members.length === 1) {
      dynamicPart = members[0]?.user?.name || members[0]?.user?.id || 'Johnny Blaze';

    }

    return `Message ${dynamicPart}`;

  }, [channel.type, channel.state.members, channel?.data?.id, channel?.data?.name, client.userID]);

  const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = useCallback(
    (event) => {
      const { value } = event.target;

      const deletePressed =
        event.nativeEvent instanceof InputEvent &&
        event.nativeEvent.inputType === 'deleteContentBackward';

      if (messageInput.text.length === 1 && deletePressed) {
        clearGiphyFlagMainInput();
      }

      if (!isComposingGiphyMessage() && messageInput.text.startsWith('/giphy') && !messageInput.numberOfUploads) {
        event.target.value = value.replace('/giphy', '');
        setComposeGiphyMessageFlag();
      }

      if (formatting === 'bold') {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 2)}**`;
        } else {
          event.target.value = `**${value.replace(/\**/g, '')}**`;
        }
      } else if (formatting === 'code') {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 1)}\``;
        } else {
          event.target.value = `\`${value.replace(/`/g, '')}\``;
        }
      } else if (formatting === 'italics') {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 1)}*`;
        } else {
          event.target.value = `*${value.replace(/\*/g, '')}*`;
        }
      } else if (formatting === 'strike-through') {
        if (deletePressed) {
          event.target.value = `${value.slice(0, value.length - 2)}~~`;
        } else {
          event.target.value = `~~${value.replace(/~~/g, '')}~~`;
        }
      }

      messageInput.handleChange(event);
    },
    [
      formatting,
      messageInput,
      clearGiphyFlagMainInput,
      isComposingGiphyMessage,
      setComposeGiphyMessageFlag,
    ],
  );

  const handleBoldButtonClick = useCallback(() => {
    setFormatting((prev) => prev === 'bold' ? null : 'bold');
  }, []);

  const handleItalicsButtonClick = useCallback(() => {
    setFormatting((prev) => prev === 'italics' ? null : 'italics')
  }, []);

  const handleStrikeThroughButtonClick = useCallback(() => {
    setFormatting((prev) => prev === 'strike-through' ? null : 'strike-through')
  }, []);

  const handleCodeButtonClick = useCallback(() => {
    setFormatting((prev) => prev === 'code' ? null : 'code')
  }, []);

  return {
    formatting,
    handleBoldButtonClick,
    handleCodeButtonClick,
    handleItalicsButtonClick,
    handleStrikeThroughButtonClick,
    placeholder,
    onChange,
  }
}