import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { SWRConfig } from 'swr';
import App from './app';
import './index.css';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateIfStale: true,
        shouldRetryOnError: false,
        revalidateOnMount: false,
        errorRetryCount: 0
      }}
    >
      <Router basename={BASE}>
        <App />
      </Router>
    </SWRConfig>
  </React.StrictMode>
);
