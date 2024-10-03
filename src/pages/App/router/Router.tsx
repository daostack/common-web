import React, { FC } from "react";
import { Switch } from "react-router-dom";
import { Layout, Redirect } from "./components";
import { ROUTES } from "./configuration";

const Router: FC = () => (
  <Switch>
    {ROUTES.map((layoutConfiguration, index) => (
        <Layout key={index} {...layoutConfiguration} />
    ))}
    <Redirect />
  </Switch>
);

export default Router;
