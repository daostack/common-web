import React, { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { CommonListItem } from "@/pages/Common/components";
import { useUserCommons } from "@/pages/Common/hooks";
import { Loader } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { Common } from "@/shared/models";
import "./index.scss";

const ActivitiesCommonsContainer: FC = () => {
  const {
    fetched: areUserCommonsFetched,
    data: myCommons,
    fetchUserCommons,
  } = useUserCommons();

  useEffect(() => {
    fetchUserCommons();
  }, [fetchUserCommons]);

  return (
    <div className="activities-commons">
      <h2 className="activities-commons__header">
        <NavLink to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}>
          <img src="/icons/left-arrow.svg" alt="left-arrow" />
          Commons ({myCommons.length})
        </NavLink>
      </h2>
      {!areUserCommonsFetched && <Loader />}
      <div className="activities-commons__commons-list">
        {myCommons.map((common: Common) => (
          <CommonListItem key={common.id} common={common} />
        ))}
      </div>
    </div>
  );
};

export default ActivitiesCommonsContainer;
