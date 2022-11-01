import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/appConfig";
import "@/shared/utils/yup";
import { NotificationProvider } from "./providers";

const AppWrapper: FC = ({ children }) => (
  <Provider store={store}>
    <NotificationProvider>{children}</NotificationProvider>
  </Provider>
);

export default AppWrapper;
