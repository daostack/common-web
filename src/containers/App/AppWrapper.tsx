import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/appConfig";
import { NotificationProvider } from "@/shared/components/Notification";
import "@/shared/utils/yup";

const AppWrapper: FC = ({ children }) => (
  <Provider store={store}>
    <NotificationProvider>{children}</NotificationProvider>
  </Provider>
);

export default AppWrapper;
