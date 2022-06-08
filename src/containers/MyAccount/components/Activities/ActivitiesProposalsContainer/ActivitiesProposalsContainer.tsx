import React, {
    useEffect,
    useCallback,
    useMemo,
    useState,
    FC,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import classNames from "classnames";

import { Proposal } from "@/shared/models";
import {
    FundingProposalListItem,
    MembershipRequestListItem,
    ProposalDetailModal
} from "@/containers/Common/components";
import { Loader, Modal } from "@/shared/components";
import { useCommonMember } from "@/containers/Common/hooks";
import { useModal } from "@/shared/hooks";
import { ProposalsTypes, ROUTE_PATHS, ScreenSize } from "@/shared/constants";
import {
    selectUserProposalList,
    selectCurrentProposal,
    selectCommonDetail,
} from "../../../../Common/store/selectors";
import { selectUser } from "../../../../Auth/store/selectors";
import {
  getLoading,
  getScreenSize,
} from "../../../../../shared/store/selectors";
import {
    getCommonDetail,
    loadUserProposalList,
    loadProposalDetail,
    clearCurrentProposal,
    closeCurrentCommon,
} from "../../../../Common/store/actions";
import "./index.scss";

interface MyProposalsContainerRouterParams {
    proposalType: ProposalsTypes;
}

const ActivitiesProposalsContainer: FC = () => {
  const dispatch = useDispatch();
  const { proposalType } = useParams<MyProposalsContainerRouterParams>();
  const myProposals = useSelector(selectUserProposalList());
  const user = useSelector(selectUser());
  const currentProposal = useSelector(selectCurrentProposal());
  const currentCommon = useSelector(selectCommonDetail());
  const loading = useSelector(getLoading());
  const screenSize = useSelector(getScreenSize());
  const { isShowing, onOpen, onClose } = useModal(false);
  const [myProposalsByType, setMyProposalsByType] = useState<Proposal[]>([]);
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
    resetCommonMember,
  } = useCommonMember();

  const isMobileView = useMemo(() => (screenSize === ScreenSize.Mobile), [screenSize]);

  const isCommonMember = Boolean(commonMember);

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      dispatch(loadProposalDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentProposal());
  }, [onClose, dispatch]);

  const renderListItem = useCallback((proposal: Proposal) => {
    switch (proposalType) {
      case ProposalsTypes.FUNDS_ALLOCATION:
        return <FundingProposalListItem
          proposal={proposal}
          key={proposal.id}
          loadProposalDetails={getProposalDetail}
        />;
      case ProposalsTypes.MEMBER_ADMITTANCE:
        return <MembershipRequestListItem
          proposal={proposal}
          key={proposal.id}
          loadProposalDetails={getProposalDetail}
        />;
    }
  }, [proposalType, getProposalDetail]);

  useEffect(() => {
    if (currentProposal) {
      fetchCommonMember(currentProposal.data.args.commonId);
    }
  }, [currentProposal, fetchCommonMember]);

  useEffect(() => {
    if (myProposals.length === 0 && user?.uid)
      dispatch(loadUserProposalList.request(user?.uid));
  }, [dispatch, myProposals, user]);

  useEffect(() => {
    if (!myProposals.length)
      return;

    const myProposalsByType = myProposals.filter((proposal) =>
      proposal.type === proposalType
    );

    setMyProposalsByType(myProposalsByType);
  }, [myProposals, setMyProposalsByType, proposalType]);

  useEffect(() => {
    if (!currentProposal) return;

    resetCommonMember();
    dispatch(
      getCommonDetail.request({
        payload: currentProposal.data.args.commonId,
      })
    );

    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, resetCommonMember, currentProposal]);

  return (
    <>
      {
        isShowing && <Modal
          isShowing={isShowing}
          onClose={closeModalHandler}
          mobileFullScreen
          className={classNames("proposals", {
              "mobile-full-screen": isMobileView,
          })}
          isHeaderSticky
          shouldShowHeaderShadow={false}
          styles={{
              headerWrapper: "activities-proposals__detail-modal-header-wrapper",
          }}
        >
          {isCommonMemberFetched ? (
            <ProposalDetailModal
              proposal={currentProposal}
              common={currentCommon}
              isCommonMember={isCommonMember}
              isCommonMemberFetched={isCommonMemberFetched}
            />
          ) : (
            <div>
              <Loader />
            </div>
          )}
        </Modal>
      }
      <div className="activities-proposals">
        <h2 className="activities-proposals__header">
          <NavLink
            to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
          >
            <img src="/icons/left-arrow.svg" alt="left-arrow" />
            {
              (proposalType === ProposalsTypes.FUNDS_ALLOCATION)
                ? "Proposals "
                : "Membership requests "
            }({myProposalsByType.length})
          </NavLink>
        </h2>
        {loading && <Loader />}
        <div className="activities-proposals__proposals-list">
          {
            myProposalsByType.map(
              proposal =>
                renderListItem(proposal)
            )
          }
        </div>
      </div>
    </>
  );
};

export default ActivitiesProposalsContainer;
