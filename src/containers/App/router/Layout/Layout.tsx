import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { LayoutConfigurationWithRouteProps } from "../types";

const Layout: FC<LayoutConfigurationWithRouteProps> = (props) => {
  const { component: LayoutComponent, routes, ...restProps } = props;

  return (
    <Route {...restProps}>
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
