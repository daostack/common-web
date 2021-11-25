import React from "react";
import { Route } from "react-router-dom";

import { ROUTE_PATHS } from "../../../../shared/constants";
import { CommonListContainer, CommonDetailContainer } from "..";

export default function CommonContainer() {
  return (
    <div>
      <Route path={ROUTE_PATHS.COMMON_DETAIL} exact={true} component={CommonDetailContainer} />
      <Route path={ROUTE_PATHS.COMMON_LIST} exact={true} component={CommonListContainer} />
    </div>
  );
}
