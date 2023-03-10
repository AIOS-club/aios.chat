import clsx from 'clsx';
import { useMemo } from 'react';
import {
  AttachmentPreviewList,
  ChatAutoComplete,
  EmojiPicker,
  SendButton,
  useChannelStateContext, useComponentContext,
  useMessageInputContext,
} from 'stream-chat-react';
import { useDropzone } from 'react-dropzone';

import { GiphyBadge } from './GiphyBadge';
import { MessageInputControlButton } from './MessageInputControls';

import { useGiphyInMessageContext } from '../../context/GiphyInMessageFlagContext';
import { useMessageInputCompositionControls } from './hooks/useMessageInputCompositionControls';

import type { StreamChatType } from '../../types';

export const TeamMessageInput = () => {
  const {TypingIndicator} = useComponentContext();

  const {
    acceptedFiles = [],
    multipleUploads,
  } = useChannelStateContext<StreamChatType>();
  const {
    handleSubmit,
    numberOfUploads,
    text,
    uploadNewFiles,
    maxFilesLeft,
    isUploadEnabled,
    openEmojiPicker,
    closeEmojiPicker,
    emojiPickerIsOpen,
  } = useMessageInputContext<StreamChatType>();
  const { isComposingGiphyMessage } = useGiphyInMessageContext();
  const {
    formatting,
    handleBoldButtonClick,
    handleCodeButtonClick,
    handleItalicsButtonClick,
    handleStrikeThroughButtonClick,
    onChange,
    placeholder,
  } = useMessageInputCompositionControls();


  const accept = useMemo(
    () =>
      acceptedFiles.reduce<Record<string, Array<string>>>((mediaTypeMap, mediaType) => {
        mediaTypeMap[mediaType] ??= [];
        return mediaTypeMap;
      }, {}),
    [acceptedFiles],
  );

  const { getRootProps, isDragActive, isDragReject } = useDropzone({
    accept,
    disabled: !isUploadEnabled || maxFilesLeft === 0,
    multiple: multipleUploads,
    noClick: true,
    onDrop: uploadNewFiles,
  });


  return (
    <div {...getRootProps({ className: clsx(`team-message-input__wrapper`) })}>
      {isDragActive && (
        <div
          className={clsx('str-chat__dropzone-container', {
            'str-chat__dropzone-container--not-accepted': isDragReject,
          })}
        >
          {!isDragReject && <p>Drag your files here</p>}
          {isDragReject && <p>Some of the files will not be accepted</p>}
        </div>
      )}
      <div className='team-message-input__input'>
        <div className='team-message-input__top'>
          {!!numberOfUploads && <AttachmentPreviewList />}
          <div className='team-message-input__form'>
            {isComposingGiphyMessage() && !numberOfUploads && <GiphyBadge />}
            <ChatAutoComplete onChange={onChange} placeholder={placeholder} />

            <SendButton
              disabled={!numberOfUploads && !text.length}
              sendMessage={handleSubmit}
            />
          </div>
        </div>
        <div className='team-message-input__bottom'>
            <MessageInputControlButton type='emoji' onClick={emojiPickerIsOpen ? closeEmojiPicker : openEmojiPicker} />
            <MessageInputControlButton type='bold' active={formatting === 'bold'} onClick={handleBoldButtonClick} />
            <MessageInputControlButton type='italics' active={formatting === 'italics'} onClick={handleItalicsButtonClick} />
            <MessageInputControlButton type='strike-through' active={formatting === 'strike-through'} onClick={handleStrikeThroughButtonClick} />
            <MessageInputControlButton type='code' active={formatting === 'code'} onClick={handleCodeButtonClick} />
        </div>
      </div>
      {TypingIndicator && <TypingIndicator />}
      <EmojiPicker />
    </div>
  );
};
