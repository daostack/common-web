import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { LayoutConfiguration } from "../types";

const Layout: FC<LayoutConfiguration> = (props) => {
  const { component: LayoutComponent, routes } = props;
  const paths = routes.map((route) => route.path);

  return (
    <Route exact path={paths}>
      <LayoutComponent>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </LayoutComponent>
    </Route>
  );
};

export default Layout;
