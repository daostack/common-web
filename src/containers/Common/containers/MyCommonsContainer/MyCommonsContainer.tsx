import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import DownloadCommonApp from "@/shared/components/DownloadCommonApp/DownloadCommonApp";
import { ProposalsTypes, ROUTE_PATHS } from "@/shared/constants";
import { isMobile } from "@/shared/utils";
import "./index.scss";
import { Common, ProposalState } from "@/shared/models";
import { getLoading } from "@/shared/store/selectors";
import { CommonListItem, EmptyTabComponent } from "../../components";
import { useUserCommons } from "../../hooks";
import { getCommonsList, loadUserProposalList } from "../../store/actions";
import {
  selectCommonList,
  selectUserProposalList,
} from "../../store/selectors";

export default function MyCommonsContainer() {
  const dispatch = useDispatch();
  const {
    fetched: areUserCommonsFetched,
    data: myCommons,
    fetchUserCommons,
  } = useUserCommons();
  const user = useSelector(selectUser());
  const commons = useSelector(selectCommonList());
  const myProposals = useSelector(selectUserProposalList());
  const loading = useSelector(getLoading());
  const [pendingCommons, setPendingCommons] = useState<Common[]>([]);
  const [isProposalLoaded, setProposalLoaded] = useState<boolean>(false);
  const [isCommonsLoadingStarted, setIsCommonsLoadingStarted] = useState(false);
  const isDataLoading = loading || !areUserCommonsFetched;

  const [hasClosedPopup, setHasClosedPopup] = useState(
    sessionStorage.getItem("hasClosedPopup")
  );

  useEffect(() => {
    if (!isCommonsLoadingStarted && commons.length === 0) {
      setIsCommonsLoadingStarted(true);
      dispatch(getCommonsList.request());
    }
  }, [dispatch, isCommonsLoadingStarted, commons]);

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid && !isProposalLoaded) {
      dispatch(loadUserProposalList.request(user?.uid));
      setProposalLoaded(true);
    }
  }, [dispatch, isProposalLoaded, myProposals, user]);

  useEffect(() => {
    fetchUserCommons();
  }, [fetchUserCommons]);

  useEffect(() => {
    // TODO: Maybe we should fetch user proposals here in other way
    const ids = myProposals
      .filter(
        (p) =>
          p.state === ProposalState.VOTING &&
          p.type === ProposalsTypes.MEMBER_ADMITTANCE
      )
      .map((p) => p.data.args.commonId);
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
      {isDataLoading && <Loader />}

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

      {myCommons.length === 0 &&
        pendingCommons.length === 0 &&
        !isDataLoading && (
          <EmptyTabComponent
            currentTab={"my-commons"}
            message={"This is where you can find your future commons"}
            title={"No commons yet"}
          />
        )}
    </div>
  );
}
