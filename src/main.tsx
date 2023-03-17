import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import './index.css';

const BASE = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Router basename={BASE}>
      <App />
    </Router>
  </React.StrictMode>
);
