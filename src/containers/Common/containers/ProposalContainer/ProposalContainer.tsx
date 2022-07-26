import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import { Loader, UserAvatar, Button, ButtonVariant } from "@/shared/components";
import { useModal } from "@/shared/hooks";
import { Proposal, ProposalState } from "@/shared/models";
import { getUserName, checkIsCountdownState } from "@/shared/utils";
import {
  ProposalsTypes,
  ChatType,
  GovernanceActions,
  ScreenSize,
} from "@/shared/constants";
import { selectUser } from "@/containers/Auth/store/selectors";
import { getScreenSize } from "@/shared/store/selectors";
import { ChatComponent } from "../../components";
import { useCommonMember, useProposalUserVote } from "../../hooks";
import {
  addMessageToProposal,
  clearCurrentProposal,
  getCommonDetail,
  loadProposalDetail,
  updateCurrentProposal,
} from "../../store/actions";
import { fetchProposalById, subscribeToProposal } from "../../store/api";
import {
  selectCommonDetail,
  selectCurrentProposal,
  selectGovernance,
} from "../../store/selectors";
import { VotingContentContainer } from "./VotingContentContainer";
import { PitchContentContainer } from "./PitchContentContainer";
import { VotingPopup } from "./VotingPopup";
import "./index.scss";

interface ProposalRouterParams {
  id: string;
}

const PROPOSAL_TYPE_CAPTION = {
  [ProposalsTypes.FUNDS_REQUEST]: "Funds Request",
  [ProposalsTypes.FUNDS_ALLOCATION]: "Funds Allocation",
  [ProposalsTypes.MEMBER_ADMITTANCE]: "Member Admittance",
  [ProposalsTypes.ASSIGN_CIRCLE]: "Assign Circle",
};

enum PROPOSAL_MENU_TABS {
  Voting = "Voting",
  Pitch = "Pitch",
  Discussions = "Discussions",
}

const ProposalContainer = () => {
  const { id: proposalId } = useParams<ProposalRouterParams>();
  const dispatch = useDispatch();
  const { isShowing, onOpen, onClose } = useModal(false);
  const user = useSelector(selectUser());
  const currentProposal = useSelector(selectCurrentProposal());
  const currentCommon = useSelector(selectCommonDetail());
  const governance = useSelector(selectGovernance());
  const [activeTab, setActiveTab] = useState<PROPOSAL_MENU_TABS>(PROPOSAL_MENU_TABS.Voting);
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const { data: userVote, fetchProposalVote, setVote } = useProposalUserVote();
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const currentProposalId = currentProposal?.id;
  const proposer = currentProposal?.proposer;
  const showVoteButton =
    !userVote &&
    currentProposal?.state === ProposalState.VOTING &&
    commonMember &&
    commonMember.allowedActions[GovernanceActions.CREATE_VOTE] &&
    currentProposal?.global.weights.some(
      ({ circles }) => commonMember.circles & circles
    );

  const sendMessage = useCallback(
    (message: string) => {
      if (currentProposal && user && user.uid) {
        const dateNow = new Date();
        const payload = {
          text: message,
          createTime: dateNow,
          ownerId: user.uid,
          commonId: currentProposal.data.args.commonId,
          discussionId: currentProposal.id,
        };

        dispatch(addMessageToProposal.request({ payload, proposal: currentProposal }));
      }
    },
    [dispatch, user, currentProposal]
  );

  const isJoiningPending = useMemo(() =>
    currentProposal
      ? (
        (currentProposal.type === ProposalsTypes.MEMBER_ADMITTANCE) &&
        checkIsCountdownState(currentProposal) &&
        (currentProposal.data.args.proposerId === user?.uid)
      )
      : false,
    [currentProposal]
  );

  const renderContentByActiveTab = useCallback((currentProposal: Proposal) => {
    switch (activeTab) {
      case PROPOSAL_MENU_TABS.Voting:
        return (
          currentCommon &&
          proposer &&
          governance && (
            <VotingContentContainer
              proposal={currentProposal}
              common={currentCommon}
              governance={governance}
              proposer={proposer}
            />
          )
        );
      case PROPOSAL_MENU_TABS.Pitch:
        return <PitchContentContainer proposal={currentProposal} />;
      case PROPOSAL_MENU_TABS.Discussions:
        return <ChatComponent
          common={currentCommon}
          discussionMessage={currentProposal.discussionMessage || []}
          type={ChatType.ProposalComments}
          isAuthorized={Boolean(user)}
          sendMessage={sendMessage}
          isJoiningPending={isJoiningPending}
          isCommonMemberFetched={isCommonMemberFetched}
          commonMember={commonMember}
        />;
    }
  }, [activeTab, currentCommon, proposer, governance]);

  const voteButtonElem = useMemo(() =>
    <Button
      variant={ButtonVariant.Primary}
      onClick={onOpen}
      className="proposal-page__proposal-vote-btn"
      shouldUseFullWidth
    >
      Vote Now
    </Button>,
    [onOpen]
  );

  const proposalTypeEl = currentProposal && (
    <div className="proposal-page__proposal-type">
      {PROPOSAL_TYPE_CAPTION[currentProposal.type] || ""}
    </div>
  );

  useEffect(() => {
    if (currentProposal?.id === proposalId) return;

    if (currentProposal || !proposalId)
      return;

    (async () => {
      try {
        const requestingProposal = await fetchProposalById(proposalId);

        dispatch(loadProposalDetail.request(requestingProposal));
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentProposal, dispatch, proposalId]);

  useEffect(() => {
    dispatch(clearCurrentProposal())
  }, [])

  useEffect(() => {
    if (currentCommon?.id === currentProposal?.data.args.commonId) return;

    if (currentCommon || !currentProposal)
      return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal.data.args.commonId,
      })
    );
  }, [currentCommon, currentProposal]);

  useEffect(() => {
    if (!currentProposalId) {
      return;
    }

    const unsubscribe = subscribeToProposal(currentProposalId, (proposal) => {
      dispatch(updateCurrentProposal(proposal));
    });

    return unsubscribe;
  }, [dispatch, currentProposalId]);

  useEffect(() => {
    if (currentCommon)
      fetchCommonMember(currentCommon.id);
  }, [fetchCommonMember, currentCommon]);

  useEffect(() => {
    if (currentProposal)
      fetchProposalVote(currentProposal.id);
  }, [fetchProposalVote, currentProposal]);

  return (currentCommon && currentProposal && isCommonMemberFetched && governance)
    ? (
      <>
        <VotingPopup
          proposal={currentProposal}
          isShowing={isShowing}
          onClose={onClose}
          setVote={setVote}
        />
        <div className="proposal-page__wrapper">
          <div className="proposal-page__common-title-wrapper section-wrapper">
            {
              isMobileView && <img
                src="/icons/left-arrow.svg"
                alt="left-arrow"
                onClick={() => history.back()}
              />
            }
            <h1 className="proposal-page__common-title">
              {currentCommon?.name}
            </h1>
          </div>
          <div className="proposal-page__heading-info-wrapper section-wrapper">
            <div className="proposal-page__heading-info-main">
              <div className="proposal-page__proposer-info-wrapper">
                <div className="proposal-page__proposer-info">
                  <UserAvatar
                    className="proposal-page__proposer-avatar"
                    photoURL={currentProposal.proposer?.photoURL}
                    nameForRandomAvatar={currentProposal.proposer?.email}
                    userName={getUserName(currentProposal.proposer)}
                  />
                  <div className="proposal-page__proposer-info-username">
                    {getUserName(currentProposal.proposer)}
                  </div>
                  {isMobileView && proposalTypeEl}
                </div>
              </div>
              <div className="proposal-page__proposal-info-wrapper">
                <div className="proposal-page__proposal-info-description">
                  <div className="proposal-title">
                    {currentProposal.data.args.title}
                  </div>
                  {!isMobileView && proposalTypeEl}
                </div>
                {
                  !isMobileView && showVoteButton && voteButtonElem
                }
              </div>
            </div>
            <div className="proposal-page__proposal-menu-wrapper">
              <ul className="proposal-page__proposal-menu">
                {
                  Object.entries(PROPOSAL_MENU_TABS).map(
                    ([key, value]) =>
                      <li
                        key={key}
                        onClick={() => setActiveTab(value)}
                        className={
                          classNames(
                            "proposal-page__proposal-menu-item",
                            {
                              active: activeTab === value
                            }
                          )
                        }
                      >
                        {value}
                      </li>
                  )
                }
              </ul>
            </div>
          </div>
          <div
            className={
              classNames(
                "proposal-page__content-wrapper",
                {
                  "chat-wrapper": activeTab === PROPOSAL_MENU_TABS.Discussions
                }
              )
            }
          >
            <div className="proposal-page__content-container section-wrapper">
              {renderContentByActiveTab(currentProposal)}
            </div>
            <div className="proposal-page__proposal-vote-btn-wrapper">
              {
                isMobileView && showVoteButton && voteButtonElem
              }
            </div>
          </div>
        </div>
      </>
    )
    : <Loader />;
};

export default ProposalContainer;
