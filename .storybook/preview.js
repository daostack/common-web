import React from "react";
import { Provider } from "react-redux";
import { store } from "../src/shared/appConfig";
import { VIEWPORTS } from "./viewports";
import "../src/index.scss";

export const parameters = {
  viewport: {
    viewports: VIEWPORTS,
    defaultViewport: "desktop",
  },
};

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <Story />
    </Provider>
  ),
];
