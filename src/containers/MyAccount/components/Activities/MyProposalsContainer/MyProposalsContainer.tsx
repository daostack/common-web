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

import { Proposal, ProposalType } from "@/shared/models";
import {
    FundingProposalListItem,
    MembershipRequestListItem,
    ProposalDetailModal
} from "@/containers/Common/components";
import { Loader, Modal } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { ROUTE_PATHS, ScreenSize } from "@/shared/constants";
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
    proposalType: ProposalType;
}

const MyProposalsContainer: FC = () => {
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

  const isMobileView = useMemo(() => (screenSize === ScreenSize.Mobile), [screenSize]);

  const isCommonMember = useMemo(() => {
    const commonMember = currentCommon?.members.find(
      (member) => member.userId === user?.uid
    );

    return Boolean(commonMember);
  }, [currentCommon, user]);

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
      case ProposalType.FundingRequest:
        return <FundingProposalListItem
          proposal={proposal}
          key={proposal.id}
          loadProposalDetails={getProposalDetail}
        />;
      case ProposalType.Join:
        return <MembershipRequestListItem
          proposal={proposal}
          key={proposal.id}
          loadProposalDetails={getProposalDetail}
        />;
    }
  }, [proposalType, getProposalDetail]);

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

    dispatch(
      getCommonDetail.request({
        payload: currentProposal?.commonId,
      })
    );

    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, currentProposal]);

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
              headerWrapper: "my-proposals__detail-modal-header-wrapper",
          }}
        >
          <ProposalDetailModal
              proposal={currentProposal}
              common={currentCommon}
              isCommonMember={isCommonMember}
          />
        </Modal>
      }
      <div className="my-proposals">
        <h2 className="my-proposals__header">
          <NavLink
            to={ROUTE_PATHS.MY_ACCOUNT_ACTIVITIES}
          >
            <img src="/icons/left-arrow.svg" alt="left-arrow" />
            {
              (proposalType === ProposalType.FundingRequest)
                ? "Proposals "
                : "Membership requests "
            }({myProposalsByType.length})
          </NavLink>
        </h2>
        {loading ? <Loader /> : null}
        <div className="my-proposals__proposals-list">
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

export default MyProposalsContainer;
