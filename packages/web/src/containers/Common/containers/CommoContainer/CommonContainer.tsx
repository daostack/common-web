import React from "react";
import { Route } from "react-router-dom";

import { ROUTE_PATHS } from "../../../../shared/constants";
import { CommonListContainer, CommonDetailContainer } from "..";
import { MyCommonsContainer } from "../MyCommonsContainer";

export default function CommonContainer() {
  return (
    <div>
      <Route path={ROUTE_PATHS.COMMON_LIST} exact={true} component={CommonListContainer} />
      <Route path={ROUTE_PATHS.MY_COMMONS} component={MyCommonsContainer} />
      <Route path={ROUTE_PATHS.COMMON_DETAIL} component={CommonDetailContainer} />
    </div>
  );
}
