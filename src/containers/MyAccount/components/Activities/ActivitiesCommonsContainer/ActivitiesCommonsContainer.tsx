import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { selectUser } from "@/containers/Auth/store/selectors";
import { selectCommonList } from "@/containers/Common/store/selectors";
import { getCommonsList } from "@/containers/Common/store/actions";
import { Loader } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { getLoading } from "@/shared/store/selectors";
import { Common } from "@/shared/models";
import { CommonListItem } from "@/containers/Common/components";
import "./index.scss";

const ActivitiesCommonsContainer: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const loading = useSelector(getLoading());
  const [myCommons, setMyCommons] = useState<Common[]>([]);

  useEffect(() => {
    if (commons.length === 0)
      dispatch(getCommonsList.request());
  }, [dispatch, commons]);

  useEffect(() => {
    if (commons.length === 0 || !user?.uid)
      return;

    const myCommons = commons.filter(
      (common: Common) =>
        common.members.some((member) => member.userId === user?.uid)
    );

    setMyCommons(myCommons);
  }, [setMyCommons, commons, user]);

  return (
    <div className="activities-commons">
      <h2 className="activities-commons__header">
        <NavLink
          to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
        >
          <img src="/icons/left-arrow.svg" alt="left-arrow" />
          Commons ({myCommons.length})
        </NavLink>
      </h2>
      {loading && <Loader />}
      <div className="activities-commons__commons-list">
        {
          myCommons.map(
            (common: Common) =>
              <CommonListItem
                key={common.id}
                common={common}
              />
          )
        }
      </div>
    </div>
  );
};

export default ActivitiesCommonsContainer;
