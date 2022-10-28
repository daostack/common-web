import React, { FC } from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import config from "@/config";
import { NotFound } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { Layout } from "./Layout";
import { ROUTES } from "./configuration";

const Routes: FC = () => {
  const history = useHistory();
  const { search: queryString } = history.location;

  return (
    <Switch>
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
      {ROUTES.map((layoutConfiguration, index) => (
        <Layout key={index} {...layoutConfiguration} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
};

export default Routes;
