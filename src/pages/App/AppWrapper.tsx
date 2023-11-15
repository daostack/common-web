import React, { FC } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/shared/appConfig";
import { NotificationProvider } from "./providers";

const AppWrapper: FC = ({ children }) => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NotificationProvider>{children}</NotificationProvider>
    </PersistGate>
  </Provider>
);

export default AppWrapper;
