import React from "react";
import { Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

import { AuthContainer } from "../Auth";
import PrivateRoute from "./PrivateRoute";
import { authentificated } from "../Auth/store/selectors";
import { Content, NotFound, LoadingIndicator, Footer, Header, Dashboard } from "../../shared/components";
import { getLoading } from "../../shared/store/selectors";
import { CommonContainer } from "../Common";
import { ROUTE_PATHS } from "../../shared/constants";

const App = () => {
  const is_authorized = useSelector(authentificated());
  const is_loading = useSelector(getLoading());

  return (
    <div className="App">
      <Header />
      <Content>
        {is_loading ? <LoadingIndicator /> : null}
        <Switch>
          <Route path={ROUTE_PATHS.AUTH} component={AuthContainer} />
          <PrivateRoute path="/" exact component={Dashboard} authentificated={is_authorized} />
          <PrivateRoute path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} authentificated={true} />
          <Route component={NotFound} />
        </Switch>
      </Content>

      <Footer />
    </div>
  );
};

export default App;
