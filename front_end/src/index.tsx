import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ChainId, DAppProvider } from "@usedapp/core";
import reportWebVitals from "./reportWebVitals";

const config = {
  supportedChains: [ChainId.Rinkeby],
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Rinkeby]:
      "https://mainnet.infura.io/v3/863287fa79c24b3fbc89cfdf220fb677",
  },
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
