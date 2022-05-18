import React from "react";
import ReactDOM from "react-dom";
import AppWrapper from "@/containers/App/AppWrapper";
import "./index.scss";
import App from "./containers/App/App";

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById("root")
);
