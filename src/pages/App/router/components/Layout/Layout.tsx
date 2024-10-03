import React, { FC, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { LayoutConfigurationWithRouteProps } from "../../types";
import { LayoutRoute } from "../LayoutRoute";
import { SuspenseLoader } from "@/shared/ui-kit";

const Layout: FC<LayoutConfigurationWithRouteProps> = (props) => {
  const { component: LayoutComponent, routes, ...restProps } = props;

  return (
    <LayoutRoute routeConfigurations={routes} {...restProps}>
      <LayoutComponent>
      <Suspense fallback={SuspenseLoader}>
        <Switch>
          {routes.map((route) => <Route key={route.path} {...route} />)}
        </Switch>
        </Suspense>
      </LayoutComponent>
    </LayoutRoute>
  );
};

export default Layout;
