import React, { FC } from "react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { history, store } from "@/shared/appConfig";

if (process.env.REACT_APP_ENV === "dev") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, { trackHooks: true });
}

const AppWrapper: FC = ({ children }) => (
  <Router history={history}>
    <Provider store={store}>{children}</Provider>
  </Router>
);

export default AppWrapper;
