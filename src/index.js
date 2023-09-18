import React from "react";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { createRoot } from "react-dom/client";

<meta
  name="google-site-verification"
  content="FcCIzSEvYXbqUgByJSGYPTcylNmk0RM6TSIh2WJC18o"
/>;

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
