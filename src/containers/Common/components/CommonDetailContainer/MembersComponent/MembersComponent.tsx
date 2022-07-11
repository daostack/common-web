import React, { FC, useState, useCallback, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Common, ProposalState } from "@/shared/models";
import { useCommonMembers } from "@/containers/Common/hooks";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { MemberListTab } from './constants'
import { MemberAdmittance } from "../../../../../shared/models/governance/proposals";
import { Loader } from "../../../../../shared/components";
import MembersList from './MembersListComponent';
import ProposalsList from './ProposalsListComponent';
import { selectProposals } from "../../../store/selectors";
import "./index.scss";

interface MembersComponentProps {
  common: Common;
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
        return <ProposalsList proposals={pendingProposals} common={common} emptyText={"No pending proposals"} />;

      case MemberListTab.History:
        return <ProposalsList proposals={historyProposals} common={common} emptyText={"History is empty"} />;

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
            {isMobileView ? 'Members' : "Members List"}
          </div>
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
