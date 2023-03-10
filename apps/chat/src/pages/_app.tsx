import type { AppProps } from "next/app";
import 'tailwindcss/tailwind.css'
import 'stream-chat-react/dist/css/v2/index.css';
import "../style/styles.css";
import "../style/layout.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
