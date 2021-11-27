import React, { useCallback, useEffect, useRef, useState } from "react";

import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { isMobile } from "../../../../shared/utils";
import { CreateCommonButton, CommonListItem, CreateCommonModal } from "../../components";
import { COMMON_PAGE_SIZE } from "../../constants";

import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import { selectCommonList, selectCurrentPage } from "../../store/selectors";
import { getLoading } from "../../../../shared/store/selectors";
import { getCommonsList, updatePage } from "../../store/actions";

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
  const [loaderHack, setLoaderHack] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showUnsavedPrompt, setShowUnsavedPrompt] = useState(false);

  const loader = useRef(null);

  const [hasClosedPopup, setHasClosedPopup] = useState(
    sessionStorage.getItem("hasClosedPopup")
  );

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
    [dispatch, loaderHack, page]
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

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setShowUnsavedPrompt(true);
  }, []);

  // See https://github.com/daostack/common-monorepo/issues/691 - the field might change in the new DB
  return (
    <div className="content-element common-list-wrapper">
      {isMobile() && !hasClosedPopup && (
        <DownloadCommonApp setHasClosedPopup={setHasClosedPopup} />
      )}
      <div className="title-wrapper">
        <h1 className="page-title">Explore Commons</h1>
        <CreateCommonButton onClick={handleModalOpen} />
      </div>
      {loading ? <Loader /> : null}
      <div className="common-list">
        {currentCommons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>

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

      <CreateCommonModal
        isShowing={isModalOpen}
        onClose={handleModalClose}
        showUnsavedPrompt={showUnsavedPrompt}
        setShowUnsavedPrompt={setShowUnsavedPrompt}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
