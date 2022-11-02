import React, { FC } from "react";
import { Router as ReactRouter } from "react-router-dom";
import { Switch } from "react-router-dom";
import { history } from "@/shared/appConfig";
import { Layout, Redirect } from "./components";
import { ROUTES } from "./configuration";

const Router: FC = () => (
  <ReactRouter history={history}>
    <Switch>
      {ROUTES.map((layoutConfiguration, index) => (
        <Layout key={index} {...layoutConfiguration} />
      ))}
      <Redirect />
    </Switch>
  </ReactRouter>
);

export default Router;
