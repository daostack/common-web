import React from "react";
import ReactDOM from "react-dom";
import AppWrapper from "@/containers/App/AppWrapper";
import "./index.scss";
import App from "./containers/App/App";
import './i18n';

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById("root")
);
