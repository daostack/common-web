import React, { useCallback, useEffect, useRef, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { getLoading } from "../../../../shared/store/selectors";
import { isMobile } from "../../../../shared/utils";

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
  const [loaderHack, setLoaderHack] = useState(false);
  const [hasClosedPopup, setHasClosedPopup] = useState(sessionStorage.getItem("hasClosedPopup"));

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];

      if (target.isIntersecting && page < 3 && !loaderHack) {
        dispatch(updatePage(page + 1));
      }
    },
    [dispatch, loaderHack, page],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current as any);
    }
  }, [handleObserver, commons]);

  const currentCommons = [...commons].splice(0, COMMON_PAGE_SIZE * page);

  const loadHack = () => {
    setLoaderHack(true);
    setTimeout(() => {
      dispatch(updatePage(page + 1));
      setLoaderHack(false);
    }, 500);
  };

  return (
    <div className="common-list-wrapper">
      {isMobile() && !hasClosedPopup && <DownloadCommonApp setHasClosedPopup={setHasClosedPopup} />}
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
        <div className="loader-container">
          {page < 3 && !loaderHack ? <div ref={loader} /> : null}
          {loaderHack ? <Loader /> : null}
          {page >= 3 && !loaderHack ? (
            <div className="loading-btn button-blue" onClick={() => loadHack()}>
              Load more Commons
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
