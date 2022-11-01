import React, { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/shared/appConfig";
import { Environment, REACT_APP_ENV } from "@/shared/constants";
import "@/shared/utils/yup";

if ([Environment.Local, Environment.Dev].includes(REACT_APP_ENV)) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, { trackHooks: true });
}

const AppWrapper: FC = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export default AppWrapper;
