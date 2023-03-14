/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite/client" />

declare const COMMIT_VERSION: string;
declare const APP_ENV: string;

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.less' {
  const content: any;
  export default content;
}
