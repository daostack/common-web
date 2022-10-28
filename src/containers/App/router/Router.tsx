import React, { FC } from "react";
import { Router as ReactRouter } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import config from "@/config";
import { history } from "@/shared/appConfig";
import { NotFound } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { Layout } from "./Layout";
import { ROUTES } from "./configuration";

const Router: FC = () => {
  const { search: queryString } = history.location;

  return (
    <ReactRouter history={history}>
      <Switch>
        {ROUTES.map((layoutConfiguration, index) => (
          <Layout key={index} {...layoutConfiguration} />
        ))}
        <Redirect
          from={ROUTE_PATHS.DEAD_SEA}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.deadSeaCommonId,
          )}${queryString}`}
        />
        <Redirect
          from={ROUTE_PATHS.PARENTS_FOR_CLIMATE}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.parentsForClimateCommonId,
          )}${queryString}`}
        />
        <Redirect
          from={ROUTE_PATHS.SAVE_SAADIA}
          to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
            ":id",
            config.saadiaCommonId,
          )}${queryString}`}
        />
        <Route component={NotFound} />
      </Switch>
    </ReactRouter>
  );
};

export default Router;
