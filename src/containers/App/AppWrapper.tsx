import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/appConfig";
import "@/shared/utils/yup";

const AppWrapper: FC = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default AppWrapper;
