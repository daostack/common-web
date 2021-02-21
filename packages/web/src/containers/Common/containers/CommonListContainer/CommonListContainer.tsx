import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCommonsList } from "../../store/actions";
import { selectCommonList } from "../../store/selectors";

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
    <div>
      <ul>
        {commons.map((c) => (
          <li key={c.id}>
            <Link to={`/commons/` + c.id}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
