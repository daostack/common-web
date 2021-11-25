import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { isMobile } from "../../../../shared/utils";
import { CommonListItem } from "../../components";
import "./index.scss";
import { Common } from "../../../../shared/models";
import { getCommonsList, loadUserProposalList } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommonList,
  selectUserProposalList,
} from "../../store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import { getLoading } from "../../../../shared/store/selectors";

export default function MyCommonsContainer() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const myProposals = useSelector(selectUserProposalList());
  const loading = useSelector(getLoading());
  const [pendingCommons, setPendingCommons] = useState<Common[]>([]);
  const [myCommons, setMyCommons] = useState<Common[]>([]);

  const [hasClosedPopup, setHasClosedPopup] = useState(
    sessionStorage.getItem("hasClosedPopup")
  );

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid) {
      dispatch(loadUserProposalList.request(user?.uid));
    }
  }, [dispatch, myProposals, user]);

  useEffect(() => {
    const myCommons = commons.filter((c) =>
      c.members.some((m) => m.userId === user?.uid)
    );
    setMyCommons(myCommons);
  }, [commons, user]);

  useEffect(() => {
    const ids = myProposals
      .filter((p) => p.state === "countdown")
      .map((p) => p.commonId);
    const pC = commons.filter((c) => ids.includes(c.id));
    setPendingCommons(pC);
  }, [myProposals, commons]);

  return (
    <div className="content-element my-commons-wrapper">
      {isMobile() && !hasClosedPopup && (
        <DownloadCommonApp setHasClosedPopup={setHasClosedPopup} />
      )}
      <div className="page-top-wrapper">
        <h1 className="page-title">My Commons</h1>
        <Link className="button-blue" to={ROUTE_PATHS.COMMON_LIST}>
          Browse all Commons
        </Link>
      </div>
      {loading ? <Loader /> : null}
      <div className="common-list">
        {myCommons.map((c) => (
          <CommonListItem common={c} key={c.id} />
        ))}
      </div>

      {pendingCommons.length ? (
        <div className="pending-commons">
          <div className="pending-title">Pending</div>
          <div className="common-list">
            {pendingCommons.map((c) => (
              <CommonListItem common={c} key={c.id} />
            ))}
          </div>
        </div>
      ) : null}

      {myCommons.length === 0 && !loading && (
        <div className="no-commons-label">No Commons Yet</div>
      )}
    </div>
  );
}
