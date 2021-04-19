import React from "react";
import { Route, Switch } from "react-router-dom";
import { AuthContainer } from "../Auth";
import PrivateRoute from "./PrivateRoute";
import { Content, NotFound, Footer, Header } from "../../shared/components";
import { CommonContainer } from "../Common";
import { LandingContainer } from "../Landing";
import { ROUTE_PATHS } from "../../shared/constants";

const App = () => {
  return (
    <div className="App">
      <Header />
      <Content>
        <Switch>
          <Route path={ROUTE_PATHS.AUTH} component={AuthContainer} />
          <Route path="/" exact component={LandingContainer} />
          <PrivateRoute path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} authentificated={true} />
          <Route component={NotFound} />
        </Switch>
      </Content>
      <Footer />
    </div>
  );
};

export default App;
