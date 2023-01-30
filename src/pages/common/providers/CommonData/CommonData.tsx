import React, { FC, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonMemberEvent, CommonMemberEventEmitter } from "@/events";
import {
  CreateCommonModal,
  CreateProposalModal,
  LeaveCommonModal,
  MembershipRequestModal,
} from "@/pages/OldCommon/components";
import { useAuthorizedModal, useNotification } from "@/shared/hooks";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { projectsActions } from "@/store/states";
import { CommonMenuItem } from "../../constants";
import { LeaveCircleModal } from "./components";
import { JoinCircleModal } from "./components/JoinCircleModal";
import { CommonDataContext, CommonDataContextValue } from "./context";
import {
  useLeaveCircleModal,
  useProposalCreationModal,
  useSubCommonCreationModal,
  useJoinCircleModal,
} from "./hooks";

interface CommonDataProps {
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  isCommonMemberFetched: boolean;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
  isJoinPending: boolean;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

const CommonData: FC<CommonDataProps> = (props) => {
  const {
    common,
    governance,
    commonMember,
    isCommonMemberFetched,
    parentCommons,
    subCommons,
    parentCommon,
    parentCommonSubCommons,
    setIsJoinPending,
    children,
  } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<CommonMenuItem | null>(null);
  const {
    isProposalCreationModalOpen,
    initialProposalTypeForCreation,
    onProposalCreationModalClose,
    onCommonDelete,
    redirectToProposalPage,
  } = useProposalCreationModal();
  const {
    isSubCommonCreationModalOpen,
    areNonCreatedProjectsLeft,
    onSubCommonCreationModalOpen,
    onSubCommonCreationModalClose,
    onSubCommonCreate,
  } = useSubCommonCreationModal(governance.circles, subCommons);
  const {
    circleToLeave,
    isLeaveCircleModalOpen,
    onLeaveCircleModalOpen,
    onLeaveCircleModalClose,
  } = useLeaveCircleModal();
  const {
    circleNameToJoin,
    createAssignProposalJoinPayload,
    isJoinCircleModalOpen,
    onJoinCircleModalClose,
    onJoinCircleModalOpen,
  } = useJoinCircleModal();
  const {
    isModalOpen: isCommonJoinModalOpen,
    onOpen: onCommonJoinModalOpen,
    onClose: onCommonJoinModalClose,
  } = useAuthorizedModal();
  const isProject = Boolean(common.directParent);

  const isJoinPending =
    isCommonMemberFetched && !commonMember && props.isJoinPending;
  const isJoinAllowed =
    isCommonMemberFetched && !commonMember && !isJoinPending;

  const handleMenuItemSelect = useCallback(
    (menuItem: CommonMenuItem | null) => {
      setSelectedMenuItem(menuItem);

      if (menuItem === CommonMenuItem.DeleteCommon) {
        onCommonDelete();
      }
    },
    [onCommonDelete],
  );

  const handleMenuClose = () => {
    setSelectedMenuItem(null);
  };

  const handleSuccessfulLeave = () => {
    if (commonMember) {
      CommonMemberEventEmitter.emit(CommonMemberEvent.Clear, commonMember.id);
    }

    dispatch(projectsActions.removeMembershipFromProjectAndChildren(common.id));
    notify("You’ve successfully left the common");
    handleMenuClose();
  };

  const contextValue = useMemo<CommonDataContextValue>(
    () => ({
      onMenuItemSelect: handleMenuItemSelect,
      areNonCreatedProjectsLeft,
      onProjectCreate: onSubCommonCreationModalOpen,
      common,
      governance,
      parentCommons,
      subCommons,
      parentCommon,
      parentCommonSubCommons,
      isJoinAllowed,
      isJoinPending,
      onJoinCommon: isProject ? undefined : onCommonJoinModalOpen,
      onLeaveCircle: onLeaveCircleModalOpen,
      onJoinCircle: onJoinCircleModalOpen,
    }),
    [
      handleMenuItemSelect,
      areNonCreatedProjectsLeft,
      onSubCommonCreationModalOpen,
      common,
      governance,
      parentCommons,
      subCommons,
      parentCommon,
      parentCommonSubCommons,
      isJoinAllowed,
      isJoinPending,
      isProject,
      onCommonJoinModalOpen,
      onLeaveCircleModalOpen,
      onJoinCircleModalOpen,
    ],
  );

  return (
    <CommonDataContext.Provider value={contextValue}>
      {children}
      {commonMember && (
        <LeaveCommonModal
          isShowing={selectedMenuItem === CommonMenuItem.LeaveCommon}
          onClose={handleMenuClose}
          commonId={common.id}
          memberCount={common.memberCount}
          memberCircleIds={Object.values(commonMember.circles.map)}
          onSuccessfulLeave={handleSuccessfulLeave}
        />
      )}
      {isProposalCreationModalOpen && commonMember && (
        <CreateProposalModal
          isShowing
          onClose={onProposalCreationModalClose}
          common={common}
          governance={governance}
          commonMember={commonMember}
          redirectToProposal={redirectToProposalPage}
          initialProposalType={initialProposalTypeForCreation}
        />
      )}
      <CreateCommonModal
        isShowing={isSubCommonCreationModalOpen}
        onClose={onSubCommonCreationModalClose}
        governance={governance}
        parentCommonId={common.id}
        subCommons={subCommons}
        onGoToCommon={onSubCommonCreate}
        isSubCommonCreation
        shouldBeWithoutIntroduction
      />
      {circleToLeave && commonMember && (
        <LeaveCircleModal
          circle={circleToLeave}
          commonId={common.id}
          commonMemberId={commonMember.id}
          isShowing={isLeaveCircleModalOpen}
          onClose={onLeaveCircleModalClose}
        />
      )}
      {circleNameToJoin && createAssignProposalJoinPayload && (
        <JoinCircleModal
          isShowing={isJoinCircleModalOpen}
          onClose={onJoinCircleModalClose}
          circleName={circleNameToJoin}
          payload={createAssignProposalJoinPayload}
        />
      )}
      <MembershipRequestModal
        isShowing={isJoinAllowed && isCommonJoinModalOpen}
        onClose={onCommonJoinModalClose}
        common={common}
        governance={governance}
        onRequestCreated={() => setIsJoinPending(true)}
      />
    </CommonDataContext.Provider>
  );
};

export default CommonData;
