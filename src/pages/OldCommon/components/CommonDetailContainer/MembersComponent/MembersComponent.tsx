import React, {
  FC,
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useCommonMembers } from "@/pages/OldCommon/hooks";
import { ProposalsTypes, ScreenSize } from "@/shared/constants";
import { Common, ProposalState } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { checkIsCountdownState, checkIsProject } from "@/shared/utils";
import { Loader } from "../../../../../shared/components";
import { MemberAdmittance } from "../../../../../shared/models/governance/proposals";
import { selectProposals } from "../../../store/selectors";
import MembersList from "./MembersListComponent";
import ProposalsList from "./ProposalsListComponent";
import { MemberListTab } from "./constants";
import "./index.scss";

interface MembersComponentProps {
  common: Common;
}

const MembersComponent: FC<MembersComponentProps> = ({ common }) => {
  const membersMenuRef = useRef<HTMLDivElement>(null);
  const [isMembersMenuSticked, setIsMembersMenuSticked] =
    useState<boolean>(false);

  const {
    fetched: areCommonMembersFetched,
    data: commonMembers,
    fetchCommonMembers,
  } = useCommonMembers({ commonId: common.id });
  const sortedCommonMembers = useMemo(
    () =>
      [...commonMembers].sort(
        (commonMember, prevCommonMember) =>
          prevCommonMember.joinedAt?.seconds - commonMember.joinedAt?.seconds,
      ),
    [commonMembers],
  );

  const proposals = useSelector(selectProposals());

  const initialMembersMenuOffsetTop = membersMenuRef.current?.offsetTop || null;

  const [activeMenuItem, setActiveMenuItem] = useState<MemberListTab>(
    MemberListTab.Members,
  );

  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const pendingProposals = useMemo(
    () =>
      proposals.filter(
        (proposal) =>
          proposal.type === ProposalsTypes.MEMBER_ADMITTANCE &&
          checkIsCountdownState(proposal),
      ) as MemberAdmittance[],
    [proposals],
  );

  const historyProposals = useMemo(
    () =>
      proposals.filter(
        (proposal) =>
          proposal.type === ProposalsTypes.MEMBER_ADMITTANCE &&
          proposal.state !== ProposalState.VOTING &&
          proposal.state !== ProposalState.DISCUSSION,
      ) as MemberAdmittance[],
    [proposals],
  );

  const renderTab = useCallback(
    (activeMenuItem: MemberListTab) => {
      switch (activeMenuItem) {
        case MemberListTab.Members:
          return (
            <MembersList
              members={sortedCommonMembers}
              commonId={common.id}
              governanceId={common.governanceId}
              isProject={checkIsProject(common)}
            />
          );

        case MemberListTab.Pending:
          return (
            <ProposalsList
              proposals={pendingProposals}
              emptyText={"No pending proposals"}
            />
          );

        case MemberListTab.History:
          return (
            <ProposalsList
              proposals={historyProposals}
              emptyText={"History is empty"}
            />
          );

        default:
          return null;
      }
    },
    [sortedCommonMembers, pendingProposals, historyProposals, common.id],
  );

  useEffect(() => {
    if (common.id) {
      fetchCommonMembers();
    }
  }, [fetchCommonMembers, common.id]);

  useEffect(() => {
    if (!isMobileView || !initialMembersMenuOffsetTop) return;

    setIsMembersMenuSticked(
      window.pageYOffset >= initialMembersMenuOffsetTop + 680,
    );
  }, [isMobileView, initialMembersMenuOffsetTop, window.pageYOffset]);

  return (
    <div className="members__component-wrapper">
      <div className="members__component-header-wrapper">
        <div className="members__common-title-wrapper">
          <div className="members__common-title">
            {isMobileView ? "Members" : "Members List"}
          </div>
        </div>
      </div>
      <div
        ref={membersMenuRef}
        className={classNames(
          "members__menu-wrapper",
          "members__section-element",
          {
            sticked: isMembersMenuSticked,
          },
        )}
      >
        <ul className="members__menu">
          <li
            onClick={() => setActiveMenuItem(MemberListTab.Members)}
            className={classNames({
              active: activeMenuItem === MemberListTab.Members,
              isMobileView,
            })}
          >
            {MemberListTab.Members} ({sortedCommonMembers.length})
          </li>
          <li
            onClick={() => setActiveMenuItem(MemberListTab.Pending)}
            className={classNames({
              active: activeMenuItem === MemberListTab.Pending,
              isMobileView,
            })}
          >
            {MemberListTab.Pending} ({pendingProposals.length})
          </li>
          <li
            onClick={() => setActiveMenuItem(MemberListTab.History)}
            className={classNames({
              active: activeMenuItem === MemberListTab.History,
              isMobileView,
            })}
          >
            {MemberListTab.History} ({historyProposals.length})
          </li>
        </ul>
      </div>
      <div
        ref={membersMenuRef}
        className={classNames(
          "members__menu-wrapper",
          "members__section-element",
          "members__section-list",
        )}
      >
        {!areCommonMembersFetched && <Loader />}
        {areCommonMembersFetched && renderTab(activeMenuItem)}
      </div>
    </div>
  );
};

export default MembersComponent;
