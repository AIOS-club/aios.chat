/// <reference types="vite-plugin-pages/client-react" />
/// <reference types="vite/client" />

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
