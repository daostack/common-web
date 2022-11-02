import React, { FC } from "react";
import {
  Redirect as RouterRedirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import config from "@/config";
import { NotFound } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";

const Redirect: FC = () => {
  const history = useHistory();
  const { search: queryString } = history.location;

  return (
    <Switch>
      <RouterRedirect
        from={ROUTE_PATHS.DEAD_SEA}
        to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
          ":id",
          config.deadSeaCommonId,
        )}${queryString}`}
      />
      <RouterRedirect
        from={ROUTE_PATHS.PARENTS_FOR_CLIMATE}
        to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
          ":id",
          config.parentsForClimateCommonId,
        )}${queryString}`}
      />
      <RouterRedirect
        from={ROUTE_PATHS.SAVE_SAADIA}
        to={`${ROUTE_PATHS.COMMON_SUPPORT.replace(
          ":id",
          config.saadiaCommonId,
        )}${queryString}`}
      />
      <Route component={NotFound} />
    </Switch>
  );
};

export default Redirect;
