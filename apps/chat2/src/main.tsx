// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import "./index.css";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );


import * as React from 'react';
import App from './App';
import { createRoot } from 'react-dom/client';
import 'tailwindcss/tailwind.css'

import './styles/index.scss';

console.log("12312312---")

createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>,
);

// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import App from "./App";

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// );