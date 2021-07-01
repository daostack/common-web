import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useGetCommonDataQuery } from "../../../../graphql";
import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { isMobile } from "../../../../shared/utils";

import { CommonListItem } from "../../components";
import { COMMON_PAGE_SIZE } from "../../constants";

import "./index.scss";

const options = {
  root: null,
  rootMargin: "20px",
  threshold: 1.0,
};

export default function CommonListContainer() {
  const [page, setPage] = useState(1);
  const loader = useRef(null);
  const previousData: any = useRef();
  const [hasClosedPopup, setHasClosedPopup] = useState(sessionStorage.getItem("hasClosedPopup"));

  const { loading, data } = useGetCommonDataQuery({
    variables: {
      paginate: {
        take: COMMON_PAGE_SIZE,
        skip: 0 + (page - 1) * COMMON_PAGE_SIZE,
      },
    },
  });

  useEffect(() => {
    previousData.current = [...(previousData.current || []), ...(data?.commons || [])];
  });

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];
      if (target.isIntersecting && page < 3 && !loading) {
        setPage(page + 1);
      }
    },
    [setPage, loading, page],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current as any);
    }
  }, [handleObserver]);

  const currentCommons = useMemo(() => [...(previousData.current || []), ...(data?.commons ?? [])], [data]);

  // See https://github.com/daostack/common-monorepo/issues/691 - the field might change in the new DB
  return (
    <div className="content-element common-list-wrapper">
      {isMobile() && !hasClosedPopup && <DownloadCommonApp setHasClosedPopup={setHasClosedPopup} />}
      <h1 className="page-title">Explore commons</h1>

      <div className="common-list">
        {currentCommons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>

      <div className="loader-container">
        {page < 3 ? <div ref={loader} /> : null}
        {loading ? <Loader /> : null}
        {page >= 3 && !loading ? (
          <div className="loading-btn button-blue" onClick={() => setPage(page + 1)}>
            Load more Commons
          </div>
        ) : null}
      </div>
    </div>
  );
}
