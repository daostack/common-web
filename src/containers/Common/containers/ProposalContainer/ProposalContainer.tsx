import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import classNames from "classnames";

import { fetchProposalById } from "../../store/api";
import {
  Loader,
  UserAvatar,
  Button,
  ButtonVariant,
} from "@/shared/components";
import { Proposal, VoteOutcome } from "@/shared/models";
import { getUserName, checkIsCountdownState } from "@/shared/utils";
import { ProposalsTypes, ChatType } from "@/shared/constants";
import { addMessageToProposal } from "@/containers/Common/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { selectCommonDetail, selectCurrentProposal } from "../../../Common/store/selectors";
import { getCommonDetail, loadProposalDetail } from "../../../Common/store/actions";
import { VotingContentContainer } from "./VotingContentContainer";
import { PitchContentContainer } from "./PitchContentContainer";
import { ChatComponent } from "../../components";
import { useCommonMember } from "../../hooks";
import { useModal } from "@/shared/hooks";
import "./index.scss";

interface ProposalRouterParams {
  id: string;
}

const PROPOSAL_TYPE_CAPTION = {
  [ProposalsTypes.FUNDS_REQUEST]: 'Funds Request',
  [ProposalsTypes.FUNDS_ALLOCATION]: 'Funds Allocation',
  [ProposalsTypes.MEMBER_ADMITTANCE]: 'Membership Request',
}

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
  const [activeTab, setActiveTab] = useState<PROPOSAL_MENU_TABS>(PROPOSAL_MENU_TABS.Voting);
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();

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
        return <VotingContentContainer proposal={currentProposal} />;
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
  }, [activeTab, currentCommon]);

  useEffect(() => {
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
    if (currentCommon || !currentProposal)
      return;

    dispatch(
      getCommonDetail.request({
        payload: currentProposal.data.args.commonId,
      })
    );
  }, [currentCommon, currentProposal]);

  useEffect(() => {
    if (currentCommon)
      fetchCommonMember(currentCommon.id);
  }, [fetchCommonMember, currentCommon]);

  // useEffect(() => {
  //   if (currentProposal)
  //     console.log("currentProposal.proposer  ", currentProposal.proposer);
  // });

  return (currentCommon && currentProposal)
    ? (
      <>
        {/* {isShowing && (
          <VotePrompt
            isShowing={isShowing}
            onClose={onClose}
            proposalId={currentProposal.id}
            proposalVotes={currentProposal.votes}
            voteType={voteType!}
            avatarURL={user?.photoURL ?? ""}
            onVoteUpdate={setVote}
          />
        )} */}
        <div className="proposal-page__wrapper">
          <div className="proposal-page__heading-info-wrapper section-wrapper">
            <h1 className="proposal-page__common-title">
              {currentCommon?.name}
            </h1>
            <div className="proposal-page__proposer-info-wrapper">
              <div className="proposal-page__proposer-info">
                <UserAvatar
                  photoURL={currentProposal.proposer?.photoURL}
                  nameForRandomAvatar={currentProposal.proposer?.email}
                  userName={getUserName(currentProposal.proposer)}
                />
                <div className="proposal-page__proposer-info-username">
                  {getUserName(currentProposal.proposer)}
                </div>
              </div>
            </div> 
            <div className="proposal-page__proposal-info-wrapper">
              <div className="proposal-page__proposal-info-description">
                <div className="proposal-title">
                  {currentProposal.data.args.title}
                </div>
                <div className="proposal-type">
                  {PROPOSAL_TYPE_CAPTION[currentProposal.type] || ""}
                </div>
              </div>
              <Button
                variant={ButtonVariant.Primary}
                onClick={onOpen}
                className="proposal-page__proposal-vote-btn"
              >
                Vote Now
              </Button>
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
          </div>
        </div>
      </>
    )
    : <Loader />;
};

export default ProposalContainer;
