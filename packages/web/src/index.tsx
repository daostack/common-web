import React from "react";
import ReactDOM from "react-dom";
import { IfFirebaseAuthed, IfFirebaseUnAuthed } from "@react-firebase/auth";
import { Router } from "react-router-dom";
import { ApolloProvider } from "./providers/ApolloProvider";
import { AuthenticationProvider } from "./providers/AuthenticationProvider";
import { UserContextProvider } from "./context/UserContext";

import "./index.scss";
import App from "./containers/App/App";
import history from "./shared/history";

if (process.env.REACT_APP_ENV === "dev") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, { trackHooks: true });
}

ReactDOM.render(
  <Router history={history}>
    <AuthenticationProvider>
      <ApolloProvider>
        <IfFirebaseAuthed>
          {() => (
            <UserContextProvider>
              <App />
            </UserContextProvider>
          )}
        </IfFirebaseAuthed>

        <IfFirebaseUnAuthed>{() => <App />}</IfFirebaseUnAuthed>
      </ApolloProvider>
    </AuthenticationProvider>
  </Router>,
  document.getElementById("root"),
);
