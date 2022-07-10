import React, {
  FC,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo
} from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import firebase from "firebase/app";

import {
  Common, CommonMemberWithUserInfo, Proposal, ProposalState
} from "@/shared/models";
import { useCommonMembers, useCommonMember } from "@/containers/Common/hooks";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { MemberListTab } from './constants'
import "./index.scss";
import { MemberAdmittance } from "../../../../../shared/models/governance/proposals";
import { selectCurrentProposal, selectGovernance, selectProposals } from "../../../store/selectors";
import { numberToBinary } from "../CommonWhitepaper/utils";
import { v4 } from "uuid";
import { Loader, Modal, UserAvatar } from "../../../../../shared/components";
import ProposalItemComponent from "../ProposalsComponent/ProposalItemComponent";
import { clearCurrentProposal, loadProposalDetail } from "../../../store/actions";
import { useModal } from "../../../../../shared/hooks";
import { ProposalDetailModal } from "../ProposalDetailModal";

interface MembersComponentProps {
  common: Common;
}

interface MembersListComponentProps {
  members: CommonMemberWithUserInfo[];
}

interface ProposalsListComponentProps {
  proposals: MemberAdmittance[];
  common: Common
}

interface CommonMemberProps {
  circles: string;
  memberName: string;
  avatar: string | undefined;
  joinedAt: firebase.firestore.Timestamp;
}

const CommonMember: FC<CommonMemberProps> = ({ circles, memberName, avatar, joinedAt }) => {

  return <li key={v4()} className="members__section__common-member"
  >
    <div className="members__section__common-member-details">
      <UserAvatar photoURL={avatar} className="members__section__common-member-avatar" />
      <div className="members__section__common-member-text-container">
        <div className="members__section__common-member-circles">{circles}</div>
        <div className="members__section__common-member-name">{memberName}</div>
      </div>
    </div>
    <div className="members__section__common-member-date">{joinedAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
  </li>
}


const MembersList: FC<MembersListComponentProps> = ({ members }) => {
  const governance = useSelector(selectGovernance());

  return <ul className="members__section__members-list">
    {members.map(member => {
      const circlesIndexs = Array.from(numberToBinary(member.circles), Number)

      let circlesString = ''
      const memberName = `${member.user.firstName} ${member.user.lastName}`


      circlesIndexs.forEach((bin, index) => {
        if (bin && governance?.circles[index]) circlesString += `${governance.circles[index].name}, `
      })

      circlesString = circlesString.slice(0, -2)

      return <CommonMember circles={circlesString} memberName={memberName} avatar={member.user.photoURL} joinedAt={member.joinedAt} />
    })}
  </ul>
}


const ProposalsList: FC<ProposalsListComponentProps> = ({ proposals, common }) => {
  const {
    fetched: isCommonMemberFetched,
    data: commonMember,
    fetchCommonMember,
  } = useCommonMember();
  const { isShowing, onOpen, onClose } = useModal(false);

  const dispatch = useDispatch()
  const currentProposal = useSelector(selectCurrentProposal());

  const screenSize = useSelector(getScreenSize());

  const isMobileView = useMemo(() => screenSize === ScreenSize.Mobile, [screenSize]);

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

  useEffect(() => {
    fetchCommonMember(common.id)
  }, [])

  return <div className="proposals-component-wrapper">
    <Modal
      isShowing={isShowing}
      onClose={closeModalHandler}
      mobileFullScreen
      className={classNames("proposals", {
        "mobile-full-screen": isMobileView,
      })}
      isHeaderSticky
      shouldShowHeaderShadow={false}
    >
      <ProposalDetailModal
        proposal={currentProposal}
        common={common}
        onOpenJoinModal={() => null}
        commonMember={commonMember}
        isCommonMemberFetched={isCommonMemberFetched}

      />
    </Modal>
    {proposals.map((proposal) => (
      <ProposalItemComponent
        key={proposal.id}
        proposal={proposal}
        loadProposalDetail={getProposalDetail}
        commonMember={commonMember}
      />
    ))}</div >
}

const MembersComponent: FC<MembersComponentProps> = ({ common }) => {
  const membersMenuRef = useRef<HTMLDivElement>(null);
  const [isMembersMenuSticked, setIsMembersMenuSticked] = useState<boolean>(false);

  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
    resetCommonMembers
  } = useCommonMembers();

  const proposals = useSelector(selectProposals());

  const initialMembersMenuOffsetTop = membersMenuRef.current?.offsetTop || null;

  const [activeMenuItem, setActiveMenuItem] = useState<MemberListTab>(MemberListTab.Members);

  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);

  const pendingProposals = proposals.filter(proposal => proposal.type ===
    ProposalsTypes.MEMBER_ADMITTANCE &&
    proposal.state === ProposalState.DISCUSSION ||
    proposal.state === ProposalState.VOTING) as MemberAdmittance[]

  const historyProposals = proposals.filter(proposal => proposal.type ===
    ProposalsTypes.MEMBER_ADMITTANCE &&
    proposal.state !== ProposalState.VOTING &&
    proposal.state !== ProposalState.DISCUSSION) as MemberAdmittance[]



  const renderTab = useCallback((activeMenuItem: MemberListTab) => {
    switch (activeMenuItem) {
      case MemberListTab.Members:
        return <MembersList members={commonMembers} />;

      case MemberListTab.Pending:
        return <ProposalsList proposals={pendingProposals} common={common} />;

      case MemberListTab.History:
        return <ProposalsList proposals={historyProposals} common={common} />;

      default:
        return null;
    }
  }, [activeMenuItem, areCommonMembersFetched]);

  useEffect(() => {
    fetchCommonMembers(common.id);
  }, [fetchCommonMembers, common.id]);

  useEffect(() => {
    if (!isMobileView || !initialMembersMenuOffsetTop)
      return;

    setIsMembersMenuSticked(window.pageYOffset >= (initialMembersMenuOffsetTop + 680));
  }, [isMobileView, initialMembersMenuOffsetTop, window.pageYOffset]);


  return (
    <div className="members__component-wrapper">
      <div className="members__component-header-wrapper">
        <div className="members__common-title-wrapper">
          <div className="members__common-title">
            Members List
          </div>
          {
            isMobileView
            && <div className="members__common-name">
              {common.name || ""}
            </div>
          }
        </div>
      </div>
      <div
        ref={membersMenuRef}
        className={
          classNames(
            "members__menu-wrapper",
            "members__section-element",
            {
              sticked: isMembersMenuSticked,
            }
          )
        }
      >
        <ul className="members__menu">
          <li
            onClick={() => setActiveMenuItem(MemberListTab.Members)}
            className={classNames({ active: activeMenuItem === MemberListTab.Members, isMobileView })}
          >
            {MemberListTab.Members} ({commonMembers.length})
          </li>
          <li
            onClick={() => setActiveMenuItem(MemberListTab.Pending)}
            className={classNames({ active: activeMenuItem === MemberListTab.Pending, isMobileView })}
          >
            {MemberListTab.Pending} ({pendingProposals.length})
          </li>
          <li
            onClick={() => setActiveMenuItem(MemberListTab.History)}
            className={classNames({ active: activeMenuItem === MemberListTab.History, isMobileView })}
          >
            {MemberListTab.History} ({historyProposals.length})
          </li>
        </ul>
      </div>
      <div
        ref={membersMenuRef}
        className={
          classNames(
            "members__menu-wrapper",
            "members__section-element",
            "members__section-list"
          )
        }
      >
        {!areCommonMembersFetched && <Loader />}
        {areCommonMembersFetched && renderTab(activeMenuItem)}
      </div>
    </div>
  );
};

export default MembersComponent;
