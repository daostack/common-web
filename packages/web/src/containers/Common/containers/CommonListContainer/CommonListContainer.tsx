import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Loader } from "../../../../shared/components";
import { CommonListItem } from "../../components";
import { COMMON_PAGE_SIZE } from "../../constants";
import { useGetCommonDataQuery } from "../../../../graphql";

import "./index.scss";

const options = {
  root: null,
  rootMargin: "20px",
  threshold: 1.0,
};

const TAKE_AMOUNT = 10; // TODO: Change as needed

export default function CommonListContainer() {
  const [page, setPage] = useState(0);
  const { loading, data } = useGetCommonDataQuery({
    variables: {
      paginate: {
        take: TAKE_AMOUNT,
        skip: 0 + page * TAKE_AMOUNT,
      },
    },
  });

  const loader = useRef(null);

  const handleObserver = useCallback(
    (entities: any[]) => {
      const target = entities[0];

      if (target.isIntersecting) {
        setPage(page + 1);
      }
    },
    [page],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current as any);
    }
  }, [handleObserver, data, loader]);

  const currentCommons = useMemo(() => [...(data?.commons ?? [])].splice(0, COMMON_PAGE_SIZE * page), [data, page]);

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

      {data?.commons?.length !== currentCommons.length && (
        <div className="loading" ref={loader}>
          <span>Load More</span>
        </div>
      )}
    </div>
  );
}
