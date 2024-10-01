import "./projectSetupImports";
import React from "react";
import ReactDOM from "react-dom";
import { enableMapSet } from "immer";
import { App, AppWrapper } from "@/pages/App";

enableMapSet();

ReactDOM.render(
  <AppWrapper>
    <App />
  </AppWrapper>,
  document.getElementById("root"),
);
