/// <reference types="vite/client" />

declare const ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod';
declare const BASE: string;

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_MAX_TOKENS: string
  readonly VITE_BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
