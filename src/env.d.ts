/// <reference types="vite/client" />

declare const ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod';
declare const BASE: string;

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_API_HOST_GPT4: string
  readonly VITE_CACHE_TIMES: string
  readonly VITE_BASE_URL: string
  readonly VITE_DEFAULT_PLACEHOLDER: string
  readonly VITE_DEFAULT_BOTTOM_TIPS: string
  readonly VITE_USER_AVATOR_URL: string
  readonly VITE_AI_AVATOR_URL: string
  readonly VITE_LOGO_URL: string
  readonly VITE_INFO: string
  readonly VITE_ONLY_TEXT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
