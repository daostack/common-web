import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/appConfig";
import "@/shared/utils/yup";
import App from "./App";
import { NotificationProvider } from "./providers";

const AppWrapper: FC = () => (
  <Provider store={store}>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </Provider>
);

export default AppWrapper;
