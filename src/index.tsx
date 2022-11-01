import React from "react";
import ReactDOM from "react-dom";
import { App, AppWrapper } from "@/containers/App";
import "./i18n";
import "./index.scss";

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById("root"),
);
