import React, { useCallback, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../../../shared/components";
import { getLoading } from "../../../../shared/store/selectors";

import { CommonListItem } from "../../components";
import { COMMON_PAGE_SIZE } from "../../constants";
import { getCommonsList, updatePage } from "../../store/actions";
import { selectCurrentPage, selectCommonList } from "../../store/selectors";

import "./index.scss";

const options = {
  root: null,
  rootMargin: "20px",
  threshold: 1.0,
};

export default function CommonListContainer() {
  const commons = useSelector(selectCommonList());
  const page = useSelector(selectCurrentPage());
  const loading = useSelector(getLoading());
  const dispatch = useDispatch();
  const loader = useRef(null);

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];

      if (target.isIntersecting) {
        dispatch(updatePage(page + 1));
      }
    },
    [dispatch, page],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current as any);
    }
  }, [handleObserver, commons]);

  const currentCommons = [...commons].splice(0, COMMON_PAGE_SIZE * page);

  return (
    <div className="common-list-wrapper">
      <h1 className="page-title">Explore commons</h1>

      {loading ? (
        <Loader />
      ) : (
        <div className="common-list">
          {currentCommons.map((c) => (
            <CommonListItem common={c} key={c.id} />
          ))}
        </div>
      )}

      {commons.length !== currentCommons.length && (
        <div className="loader-wrapper">
          <div className="lds-spinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="loading button-blue" ref={loader}>
            Load More Commons
          </div>
        </div>
      )}
    </div>
  );
}
