import { StreamChat } from "stream-chat";
import { Chat, enTranslations, Streami18n } from "stream-chat-react";

import { getRandomImage } from "../assets";

import type { StreamChatType } from "../types";

const urlParams = new URLSearchParams(window.location.search);

const apiKey =
  urlParams.get("apikey") || "4qnvchf3fgm3" || process.env.REACT_APP_STREAM_KEY;
const user =
  urlParams.get("user") || "longjueyue" || process.env.REACT_APP_USER_ID;
const userToken =
  urlParams.get("user_token") ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoibG9uZ2p1ZXl1ZSJ9.MZap0-U1TMwIo0Vs1Das0qCmDqd-Lo5xwr8l6NsSfnc" ||
  process.env.REACT_APP_USER_TOKEN;
export const targetOrigin =
  urlParams.get("target_origin") ||
  "https://getstream.io" ||
  process.env.REACT_APP_TARGET_ORIGIN;

export const i18nInstance = new Streami18n({
  language: "zh",
  translationsForLanguage: {
    ...enTranslations,
  },
});

const instance = StreamChat.getInstance<StreamChatType>(apiKey!, {
  enableInsights: true,
  enableWSFallback: true,
});

export const connectUserPromise = instance.connectUser(
  { id: user!, name: user, image: getRandomImage() },
  userToken
);

export const client = instance;
