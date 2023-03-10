import type { UR, LiteralStringForUnion } from 'stream-chat';

export type TeamAttachmentType = UR;
export type TeamChannelType = UR;
export type TeamCommandType = LiteralStringForUnion;
export type TeamEventType = UR;
export type TeamMessageType = UR;
export type TeamReactionType = UR;
export type TeamUserType = { image?: string };

export type StreamChatType = {
  attachmentType: TeamAttachmentType;
  channelType: TeamChannelType;
  commandType: TeamCommandType;
  eventType: TeamEventType;
  messageType: TeamMessageType;
  reactionType: TeamReactionType;
  userType: TeamUserType;
};
