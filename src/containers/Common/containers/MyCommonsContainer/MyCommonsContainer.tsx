import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Loader } from "../../../../shared/components";
import DownloadCommonApp from "../../../../shared/components/DownloadCommonApp/DownloadCommonApp";
import { ROUTE_PATHS } from "../../../../shared/constants";
import { isMobile } from "../../../../shared/utils";
import { CommonListItem } from "../../components";
import "./index.scss";
import { Common, ProposalState, ProposalType } from "../../../../shared/models";
import { getCommonsList, loadUserProposalList } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCommonList,
  selectUserProposalList,
} from "../../store/selectors";
import { selectUser } from "../../../Auth/store/selectors";
import { getLoading } from "../../../../shared/store/selectors";
import { EmptyTabComponent } from "../../components/CommonDetailContainer";

export default function MyCommonsContainer() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const myProposals = useSelector(selectUserProposalList());
  const loading = useSelector(getLoading());
  const [pendingCommons, setPendingCommons] = useState<Common[]>([]);
  const [myCommons, setMyCommons] = useState<Common[]>([]);
  const [isProposalLoaded, setProposalLoaded] = useState<boolean>(false);

  const [hasClosedPopup, setHasClosedPopup] = useState(
    sessionStorage.getItem("hasClosedPopup")
  );

  useEffect(() => {
    if (commons.length === 0) {
      dispatch(getCommonsList.request());
    }
  }, [dispatch, commons]);

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid && !isProposalLoaded) {
      dispatch(loadUserProposalList.request(user?.uid));
      setProposalLoaded(true);
    }
  }, [dispatch, isProposalLoaded, myProposals, user]);

  useEffect(() => {
    const myCommons = commons.filter((c) =>
      c.members.some((m) => m.userId === user?.uid)
    );
    setMyCommons(myCommons);
  }, [commons, user]);

  useEffect(() => {
    const ids = myProposals
      .filter(
        (p) =>
          p.state === ProposalState.COUNTDOWN && p.type === ProposalType.Join
      )
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
        {myCommons.length || pendingCommons.length ? (
          <Link className="button-blue" to={ROUTE_PATHS.COMMON_LIST}>
            Browse all Commons
          </Link>
        ) : null}
      </div>
      {loading && <Loader />}

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

      {myCommons.length === 0 && pendingCommons.length === 0 && !loading && (
        <EmptyTabComponent
          currentTab={"my-commons"}
          message={"This is where you can find your future commons"}
          title={"No commons yet"}
        />
      )}
    </div>
  );
}
