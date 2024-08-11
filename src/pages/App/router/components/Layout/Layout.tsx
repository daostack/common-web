import React, { FC, Suspense } from "react";
import { Route, Switch } from "react-router-dom";
import { Loader } from "@/shared/ui-kit";
import { LayoutConfigurationWithRouteProps } from "../../types";
import { LayoutRoute } from "../LayoutRoute";

const SuspenseLoader = (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      display: "flex",
      backgroundColor: "white",
      flex: 4,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Loader />
    </div>
  </div>
);

const Layout: FC<LayoutConfigurationWithRouteProps> = (props) => {
  const { component: LayoutComponent, routes, ...restProps } = props;

  return (
    <LayoutRoute routeConfigurations={routes} {...restProps}>
      <Suspense fallback={SuspenseLoader}>
        <LayoutComponent>
          <Switch>
            {routes.map((route) => (
              <Route key={route.path} {...route} />
            ))}
          </Switch>
        </LayoutComponent>
      </Suspense>
    </LayoutRoute>
  );
};

export default Layout;
