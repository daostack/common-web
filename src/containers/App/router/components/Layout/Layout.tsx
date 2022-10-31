import React, { FC } from "react";
import { Route, Switch } from "react-router-dom";
import { LayoutConfigurationWithRouteProps } from "../../types";
import { LayoutRoute } from "../LayoutRoute";

const Layout: FC<LayoutConfigurationWithRouteProps> = (props) => {
  const { component: LayoutComponent, routes, ...restProps } = props;

  return (
    <LayoutRoute routeConfigurations={routes} {...restProps}>
      <LayoutComponent>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} {...route} />
          ))}
        </Switch>
      </LayoutComponent>
    </LayoutRoute>
  );
};

export default Layout;
