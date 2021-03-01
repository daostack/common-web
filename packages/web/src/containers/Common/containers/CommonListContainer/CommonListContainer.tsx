import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { CommonListItem } from "../../components";
import { getCommonsList } from "../../store/actions";
import { selectCommonList } from "../../store/selectors";

import "./index.scss";

export default function CommonListContainer() {
  const commons = useSelector(selectCommonList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCommonsList.request());
    return () => {
      dispatch(getCommonsList.success([]));
    };
  }, [dispatch]);

  return (
    <div className="common-list-wrapper">
      <h1 className="page-title">Explore commons</h1>
      <div className="common-list">
        {commons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>
    </div>
  );
}
