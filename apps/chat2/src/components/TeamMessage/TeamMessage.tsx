import clsx from 'clsx';
import React, { useMemo, useRef } from 'react';
import type { TranslationLanguages } from 'stream-chat';
import {
  areMessageUIPropsEqual,
  Avatar,
  EditMessageForm,
  ErrorIcon,
  isOnlyEmojis,
  MESSAGE_ACTIONS,
  MessageActions,
  MessageContextValue,
  MessageDeleted,
  MessageInput,
  MessageRepliesCountButton,
  MessageStatus,
  MessageTimestamp,
  MessageUIComponentProps,
  // QuotedMessage,
  ReactEventHandler,
  ReactionIcon,
  ReactionSelector,
  renderText as defaultRenderText,
  showMessageActionsBox,
  SimpleReactionsList,
  ThreadIcon,
  useComponentContext,
  useMessageContext,
  useReactionClick,
  useTranslationContext,
} from 'stream-chat-react';

import { PinIndicator } from './PinIndicator';

import { useWorkspaceController } from '../../context/WorkspaceController';

import type { StreamChatType } from '../../types';


type MessageTeamWithContextProps = MessageContextValue<StreamChatType> & {
  isReactionEnabled: boolean;
  messageWrapperRef: React.MutableRefObject<HTMLDivElement | null>;
  onReactionListClick: ReactEventHandler;
  reactionSelectorRef: React.MutableRefObject<HTMLDivElement | null>;
  showDetailedReactions: boolean;
};

const MessageTeamWithContext = (
  props: MessageTeamWithContextProps,
) => {
  const {
    clearEditingState,
    editing,
    getMessageActions,
    groupStyles,
    handleAction,
    handleOpenThread,
    handleRetry,
    initialMessage,
    isReactionEnabled,
    message,
    messageWrapperRef,
    onMentionsClickMessage,
    onMentionsHoverMessage,
    onReactionListClick,
    onUserClick,
    onUserHover,
    reactionSelectorRef,
    renderText = defaultRenderText,
    showDetailedReactions,
    threadList,
  } = props;

  const { Attachment } = useComponentContext<StreamChatType>('MessageTeam');

  const { t, userLanguage } = useTranslationContext('MessageTeam');

  const messageActions = getMessageActions();
  const showActionsBox = showMessageActionsBox(messageActions);

  const shouldShowReplies = messageActions.indexOf(MESSAGE_ACTIONS.reply) > -1 && !threadList;

  const messageTextToRender =
    message.i18n?.[`${userLanguage}_text` as `${TranslationLanguages}_text`] || message.text;

  const messageMentionedUsersItem = message.mentioned_users;

  const messageText = useMemo(() => renderText(messageTextToRender, messageMentionedUsersItem), [
    messageMentionedUsersItem,
    messageTextToRender,
    renderText,
  ]);

  const firstGroupStyle = groupStyles ? groupStyles[0] : 'single';

  if (message.deleted_at) {
    return <MessageDeleted message={message} />;
  }

  if (editing) {
    return (
      <div
        className={`str-chat__message-team str-chat__message-team--${firstGroupStyle} str-chat__message-team--editing`}
        data-testid='message-team-edit'
      >
        {(firstGroupStyle === 'top' || firstGroupStyle === 'single') && (
          <div className='str-chat__message-team-meta'>
            <Avatar
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
              onClick={onUserClick}
              onMouseOver={onUserHover}
              size={34}
            />
          </div>
        )}
        <MessageInput
          clearEditingState={clearEditingState}
          Input={EditMessageForm}
          message={message}
        />
      </div>
    );
  }
  const rootClass = clsx(
    'str-chat__message',
    'str-chat__message-team',
    `str-chat__message-team--${firstGroupStyle}`,
    {
      'pinned-message': message.pinned,
      [`str-chat__message-team--${message.status}`]: message.status,
      [`str-chat__message-team--${message.type}`]: message.type,
      'str-chat__message--has-attachment': !!message.attachments?.length,
      'threadList': threadList,
    },
  );

  return (
    <>
      {message.pinned && <PinIndicator message={message} />}
      <div
        className={rootClass}
        data-testid='message-team'
        ref={messageWrapperRef}
      >
        <div className='avatar-host'>
          {firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage ? (
            <Avatar
              image={message.user?.image}
              name={message.user?.name || message.user?.id}
              onClick={onUserClick}
              onMouseOver={onUserHover}
              size={34}
            />
          ) : (
            <div data-testid='team-meta-spacer' style={{ marginRight: 0, width: 34 }} />
          )}
        </div>
        <div className='str-chat__message-team-group'>
          {(firstGroupStyle === 'top' || firstGroupStyle === 'single' || initialMessage) && (
            <div className='str-chat__message-team-meta'>
              <div
                className='str-chat__message-team-author'
                data-testid='message-team-author'
                onClick={onUserClick}
              >
                <strong>{message.user?.name || message.user?.id}</strong>
                {message.type === 'error' && (
                  <div className='str-chat__message-team-error-header'>
                    {t<string>('Only visible to you')}
                  </div>
                )}
              </div>
              <MessageTimestamp />
            </div>
          )}
          <div
            className={`str-chat__message-team-content str-chat__message-team-content--${firstGroupStyle} str-chat__message-team-content--${
              message.text === '' ? 'image' : 'text'
            }`}
            data-testid='message-team-content'
          >
            {/*{message.quoted_message && <QuotedMessage />}*/}
            {!initialMessage &&
              message.status !== 'sending' &&
              message.status !== 'failed' &&
              message.type !== 'system' &&
              message.type !== 'ephemeral' &&
              message.type !== 'error' && (
                <div
                  className={`str-chat__message-team-actions`}
                  data-testid='message-team-actions'
                >
                  {showDetailedReactions && <ReactionSelector ref={reactionSelectorRef} />}
                  {isReactionEnabled && (
                    <span
                      data-testid='message-team-reaction-icon'
                      onClick={onReactionListClick}
                      title='Reactions'
                    >
                      <ReactionIcon />
                    </span>
                  )}
                  {shouldShowReplies && (
                    <span
                      data-testid='message-team-thread-icon'
                      onClick={handleOpenThread}
                      title='Start a thread'
                    >
                      <ThreadIcon />
                    </span>
                  )}
                  {showActionsBox && (
                    <MessageActions inline messageWrapperRef={messageWrapperRef} />
                  )}
                </div>
              )}
            {message.text && (<div
                className={clsx('str-chat__message-team-text', {'str-chat__message-team-text--is-emoji': isOnlyEmojis(message.text)})}
                data-testid='message-team-message'
                onClick={onMentionsClickMessage}
                onMouseOver={onMentionsHoverMessage}
              >
                {messageText}
              </div>
            )}
            {!message.text && message.attachments?.length ? (
              <Attachment actionHandler={handleAction} attachments={message.attachments} />
            ) : null}
            {message.latest_reactions?.length !== 0 && message.text !== '' && isReactionEnabled && (
              <SimpleReactionsList />
            )}
            {message.status === 'failed' && (
              <button
                className='str-chat__message-team-failed'
                data-testid='message-team-failed'
                onClick={message.errorStatusCode !== 403 ? () => handleRetry(message) : undefined}
              >
                <ErrorIcon />
                {message.errorStatusCode !== 403
                  ? t<string>('Message Failed · Click to try again')
                  : t<string>('Message Failed · Unauthorized')}
              </button>
            )}
          </div>
          <MessageStatus messageType='team' />
          {message.text && message.attachments?.length ? (
            <Attachment actionHandler={handleAction} attachments={message.attachments} />
          ) : null}
          {message.latest_reactions &&
            message.latest_reactions.length !== 0 &&
            message.text === '' &&
            isReactionEnabled && <SimpleReactionsList />}
          {!threadList && (
            <MessageRepliesCountButton
              onClick={handleOpenThread}
              reply_count={message.reply_count}
            />
          )}
        </div>
      </div>
    </>
  );
};

const MemoizedMessageTeam = React.memo(
  MessageTeamWithContext,
  areMessageUIPropsEqual,
) as typeof MessageTeamWithContext;


export const TeamMessage = (
  props: MessageUIComponentProps<StreamChatType>,
) => {
  const messageContext = useMessageContext<StreamChatType>('MessageTeam');
  const { closePinnedMessageListOpen } = useWorkspaceController();

  const reactionSelectorRef = useRef<HTMLDivElement | null>(null);
  const messageWrapperRef = useRef<HTMLDivElement | null>(null);

  const message = props.message || messageContext.message;

  const { isReactionEnabled, onReactionListClick, showDetailedReactions } = useReactionClick(
    message,
    reactionSelectorRef,
    messageWrapperRef,
  );

  const handleOpenThreadOverride = (event: React.BaseSyntheticEvent) => {
    closePinnedMessageListOpen();
    messageContext.handleOpenThread(event);
  };

  return (
    <div className={message.pinned ? 'pinned-message' : 'unpinned-message'}>
    <MemoizedMessageTeam
      {...messageContext}
      isReactionEnabled={isReactionEnabled}
      messageWrapperRef={messageWrapperRef}
      onReactionListClick={onReactionListClick}
      reactionSelectorRef={reactionSelectorRef}
      showDetailedReactions={showDetailedReactions}
      handleOpenThread={handleOpenThreadOverride}
      {...props}
    />
    </div>
  );
};
