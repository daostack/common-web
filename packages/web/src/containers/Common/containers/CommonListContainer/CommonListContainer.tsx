import React, { useCallback, useEffect, useMemo, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

import { CommonListItem } from "../../components";
import { COMMON_PAGE_SIZE } from "../../constants";
import { getCommonsList, updatePage } from "../../store/actions";
import { getCurrentPage, selectCommonList } from "../../store/selectors";

import "./index.scss";

const options = {
  root: null,
  rootMargin: "20px",
  threshold: 1.0,
};

export default function CommonListContainer() {
  const commons = useSelector(selectCommonList);
  const page = useSelector(getCurrentPage);
  const dispatch = useDispatch();
  const loader = useRef(null);

  useEffect(() => {
    dispatch(getCommonsList.request());
    return () => {
      dispatch(getCommonsList.success([]));
    };
  }, [dispatch]);

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

  const currentCommons = useMemo(() => [...commons].splice(0, COMMON_PAGE_SIZE * page), [commons, page]);

  return (
    <div className="common-list-wrapper">
      <h1 className="page-title">Explore commons</h1>
      <div className="common-list">
        {currentCommons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>

      {commons.length !== currentCommons.length && (
        <div className="loading" ref={loader}>
          <span>Load More</span>
        </div>
      )}
    </div>
  );
}
