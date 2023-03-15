/// <reference types="vite/client" />

declare const ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod';
declare const BASE: string;

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_MAX_TOKENS: string
  readonly VITE_BASE_URL: string
  readonly VITE_DEFAULT_PLACEHOLDER: string
  readonly VITE_DEFAULT_BOTTOM_TIPS: string
  readonly VITE_USER_USER_URL: string
  readonly VITE_AI_AVATOR_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
