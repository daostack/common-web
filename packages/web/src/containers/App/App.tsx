import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import { AuthContainer } from "../Auth";
import PrivateRoute from "./PrivateRoute";
import { authentificated } from "../Auth/store/selectors";
import { Content, NotFound, LoadingIndicator, Footer, Dashboard } from "../../shared/components";
import { getLoading } from "../../shared/store/selectors";

const App = () => {
  const is_authorized = useSelector(authentificated());
  const is_loading = useSelector(getLoading());

  return (
    <div className="App">
      {is_authorized && "hello"}
      <Content>
        {!is_loading ? (
          <Switch>
            <Route path="/auth/" component={AuthContainer} />
            <PrivateRoute path="/" exact component={Dashboard} authentificated={is_authorized} />
            <Route component={NotFound} />
          </Switch>
        ) : (
          <LoadingIndicator />
        )}
      </Content>

      {is_authorized && <Footer />}
    </div>
  );
};

export default App;
