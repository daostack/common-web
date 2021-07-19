import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";

import configureStore from "./store";
import "./index.scss";
import App from "./containers/App/App";
import history from "./shared/history";
import { ApolloProvider } from "./shared/providers";

const { store } = configureStore(history);

if (process.env.REACT_APP_ENV === "dev") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, { trackHooks: true });
}

ReactDOM.render(
  <Router history={history}>
    <Provider store={store}>
      <ApolloProvider>
        <App />
      </ApolloProvider>
    </Provider>
  </Router>,
  document.getElementById("root"),
);
