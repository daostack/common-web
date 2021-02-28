import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getCommonDetail } from "../../store/actions";
import { selectCommonDetail } from "../../store/selectors";

interface CommonDetailRouterParams {
  id: string;
}

export default function CommonDetail() {
  const { id } = useParams<CommonDetailRouterParams>();
  const common = useSelector(selectCommonDetail);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCommonDetail.request(id));
    return () => {
      dispatch(getCommonDetail.success(null));
    };
  }, [dispatch, id]);
  return (
    <div>
      <pre>{JSON.stringify(common, null, 2)}</pre>
    </div>
  );
}
