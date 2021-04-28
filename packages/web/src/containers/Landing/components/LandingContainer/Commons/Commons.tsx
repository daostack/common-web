import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Loader } from "../../../../../shared/components";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import { Common } from "../../../../../shared/models";
import { getLoading } from "../../../../../shared/store/selectors";
import { CommonListItem } from "../../../../Common/components";
import { getCommonsList } from "../../../../Common/store/actions";
import { selectCommonList } from "../../../../Common/store/selectors";
import "./index.scss";

export default function Commons() {
  const commons = useSelector(selectCommonList());
  const loading = useSelector(getLoading());
  const dispatch = useDispatch();

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  // TODO: for now we show the first 8 commons. Need to filter 8 featured commons.
  const featuredCommons = commons.slice(0, 8).map((common: Common) => {
    return <CommonListItem common={common} key={common.id} />;
  });

  return (
    <div className="commons-wrapper">
      <h1>Featured Commons</h1>
      <b>Browse some of the emerging groups on the Common app</b>
      {loading ? <Loader /> : <div className="featured-commons">{featuredCommons}</div>}
      <Link className="button-blue explore-commons" to={ROUTE_PATHS.COMMON_LIST}>
        Explore all commons
      </Link>
    </div>
  );
}
