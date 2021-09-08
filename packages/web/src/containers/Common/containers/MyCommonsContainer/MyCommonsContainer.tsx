import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { createApolloClient, isMobile } from "../../../../shared/utils";
import { CommonListItem } from "../../components";

import "./index.scss";

import { Common } from "../../../../shared/models";
import { GetUserCommonsDocument } from "../../../../graphql";

export default function MyCommonsContainer() {
  const [commons, setCommons] = useState<Common[]>([]);
  const [loading, setLoading] = useState(true);
  const apollo = createApolloClient("https://api-test.staging.common.io/graphql" || "", localStorage.token || "");
  const [hasClosedPopup, setHasClosedPopup] = useState(sessionStorage.getItem("hasClosedPopup"));

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apollo.query({
          query: GetUserCommonsDocument,
        });
        setLoading(false);
        const commons = data.user?.commons.map((item: Common) => item) ?? [];
        setCommons(commons);
      } catch (e) {
        console.log(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content-element my-commons-wrapper">
      {isMobile() && !hasClosedPopup && <DownloadCommonApp setHasClosedPopup={setHasClosedPopup} />}
      <div className="page-top-wrapper">
        <h1 className="page-title">My Commons</h1>
        <Link className="button-blue" to={ROUTE_PATHS.COMMON_LIST}>
          Browse all Commons
        </Link>
      </div>

      <div className="common-list">
        {commons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>

      {commons.length === 0 && !loading && <div className="no-commons-label">No Commons Yet</div>}

      <div className="loader-container">{loading ? <Loader /> : null}</div>
    </div>
  );
}
