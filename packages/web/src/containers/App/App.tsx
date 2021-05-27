import React from "react";
import { Route, Switch } from "react-router-dom";
import { Content, Dashboard, Footer, Header, NotFound } from "../../shared/components";
import { ROUTE_PATHS } from "../../shared/constants";
import { AuthContainer } from "../Auth";
import { CommonContainer } from "../Common";
import PrivateRoute from "./PrivateRoute";


const App = () => {

  return (
    <div className="App">
      <Header />
      <Content>
        <Switch>
          <Route path={ROUTE_PATHS.AUTH} component={AuthContainer} />
          <PrivateRoute path="/" exact component={Dashboard} authentificated={true} />
          <PrivateRoute path={ROUTE_PATHS.COMMON_LIST} component={CommonContainer} authentificated={true} />
          <Route component={NotFound} />
        </Switch>
      </Content>

      <Footer />
    </div>
  );
};

export default App;
