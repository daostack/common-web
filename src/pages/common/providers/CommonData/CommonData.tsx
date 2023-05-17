import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { CommonMemberEvent, CommonMemberEventEmitter } from "@/events";
import {
  CreateProposalModal,
  LeaveCommonModal,
  MembershipRequestModal,
} from "@/pages/OldCommon/components";
import { ProposalsTypes } from "@/shared/constants";
import { useAuthorizedModal, useNotification } from "@/shared/hooks";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  SupportersData,
} from "@/shared/models";
import { getCommonPagePath, getProjectCreationPagePath } from "@/shared/utils";
import { projectsActions } from "@/store/states";
import { getDefaultGovDocUrl } from "../../components/CommonTabPanels/components/AboutTab/utils";
import { JoinProjectModal } from "../../components/JoinProjectModal";
import { CommonMenuItem } from "../../constants";
import { CommonPageSettings } from "../../types";
import { LeaveCircleModal } from "./components";
import { JoinCircleModal } from "./components/JoinCircleModal";
import { CommonDataContext, CommonDataContextValue } from "./context";
import {
  useJoinCircleModal,
  useLeaveCircleModal,
  useProposalCreationModal,
} from "./hooks";

interface CommonDataProps {
  settings: CommonPageSettings;
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  parentCommonMember: CommonMember | null;
  isGlobalDataFetched: boolean;
  parentCommons: Common[];
  subCommons: Common[];
  parentCommon?: Common;
  parentCommonSubCommons: Common[];
  supportersData: SupportersData | null;
  isJoinPending: boolean;
  setIsJoinPending: (isJoinPending: boolean) => void;
}

const CommonData: FC<CommonDataProps> = (props) => {
  const {
    settings,
    common,
    governance,
    commonMember,
    parentCommonMember,
    isGlobalDataFetched,
    parentCommons,
    subCommons,
    parentCommon,
    parentCommonSubCommons,
    supportersData,
    setIsJoinPending,
    children,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { notify } = useNotification();
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<CommonMenuItem | null>(null);
  const [
    shouldKeepShowingCommonJoinModal,
    setShouldKeepShowingCommonJoinModal,
  ] = useState(false);
  const [
    shouldKeepShowingProjectJoinModal,
    setShouldKeepShowingProjectJoinModal,
  ] = useState(false);
  const [
    shouldRedirectToFeedOnCommonMemberExistence,
    setShouldRedirectToFeedOnCommonMemberExistence,
  ] = useState(false);
  const {
    isProposalCreationModalOpen,
    initialProposalTypeForCreation,
    onProposalCreationModalClose,
    onCommonDelete,
    redirectToProposalPage,
  } = useProposalCreationModal();
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
  const {
    isModalOpen: isProjectJoinModalOpen,
    onOpen: onProjectJoinModalOpen,
    onClose: onProjectJoinModalClose,
  } = useAuthorizedModal();
  const isProject = Boolean(common.directParent);

  const isJoinPending =
    isGlobalDataFetched && !commonMember && props.isJoinPending;
  const isJoinAllowed = Boolean(
    isGlobalDataFetched &&
      ((!isProject && !commonMember) ||
        (isProject && parentCommonMember && !commonMember)) &&
      !isJoinPending,
  );

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

  const handleProjectCreate = useCallback(() => {
    history.push(getProjectCreationPagePath(common.id));
  }, [history, common.id]);

  const handleSuccessfulLeave = () => {
    if (commonMember) {
      CommonMemberEventEmitter.emit(CommonMemberEvent.Clear, commonMember.id);
    }

    dispatch(projectsActions.removeMembershipFromProjectAndChildren(common.id));
    notify("You’ve successfully left the common");
    handleMenuClose();
  };

  const handleSuccessfulProjectLeave = () => {
    if (commonMember) {
      CommonMemberEventEmitter.emit(CommonMemberEvent.Clear, commonMember.id);
    }

    dispatch(projectsActions.removeMembershipFromProjectAndChildren(common.id));
    notify("You’ve successfully left the space");
    handleMenuClose();
  };

  const handleJoinRequestCreated = () => {
    setIsJoinPending(true);
    setShouldRedirectToFeedOnCommonMemberExistence(true);
  };

  const handleCommonJoinRequestCreated = () => {
    setShouldKeepShowingCommonJoinModal(true);
    handleJoinRequestCreated();
  };

  const handleProjectJoinRequestCreated = () => {
    setShouldKeepShowingProjectJoinModal(true);
    handleJoinRequestCreated();
  };

  const handleCommonJoinModalClose = () => {
    onCommonJoinModalClose();
    setShouldKeepShowingCommonJoinModal(false);
  };

  const handleProjectJoinModalClose = () => {
    onProjectJoinModalClose();
    setShouldKeepShowingProjectJoinModal(false);
  };

  useEffect(() => {
    if (isGlobalDataFetched && !isJoinAllowed && isCommonJoinModalOpen) {
      onCommonJoinModalClose();
    }
  }, [isGlobalDataFetched, isJoinAllowed, isCommonJoinModalOpen]);

  useEffect(() => {
    if (isGlobalDataFetched && !isJoinAllowed && isProjectJoinModalOpen) {
      onProjectJoinModalClose();
    }
  }, [isGlobalDataFetched, isJoinAllowed, isProjectJoinModalOpen]);

  useEffect(() => {
    if (shouldRedirectToFeedOnCommonMemberExistence && commonMember) {
      history.push(getCommonPagePath(common.id));
    }
  }, [shouldRedirectToFeedOnCommonMemberExistence, commonMember]);

  const contextValue = useMemo<CommonDataContextValue>(
    () => ({
      settings,
      onMenuItemSelect: handleMenuItemSelect,
      onProjectCreate: handleProjectCreate,
      common,
      governance,
      parentCommons,
      subCommons,
      parentCommon,
      parentCommonSubCommons,
      supportersData,
      isJoinAllowed,
      isJoinPending,
      onJoinCommon: isProject ? onProjectJoinModalOpen : onCommonJoinModalOpen,
      onLeaveCircle: onLeaveCircleModalOpen,
      onJoinCircle: onJoinCircleModalOpen,
    }),
    [
      settings,
      handleMenuItemSelect,
      handleProjectCreate,
      common,
      governance,
      parentCommons,
      subCommons,
      parentCommon,
      parentCommonSubCommons,
      supportersData,
      isJoinAllowed,
      isJoinPending,
      isProject,
      onCommonJoinModalOpen,
      onLeaveCircleModalOpen,
      onJoinCircleModalOpen,
      onProjectJoinModalOpen,
    ],
  );

  useEffect(() => {
    if (selectedMenuItem === CommonMenuItem.Governance) {
      window.open(common.governanceDocumentUrl ?? getDefaultGovDocUrl(common));
      handleMenuClose();
    }
  }, [selectedMenuItem]);

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
      {commonMember && common.directParent && (
        <LeaveCommonModal
          isShowing={selectedMenuItem === CommonMenuItem.LeaveProject}
          onClose={handleMenuClose}
          commonId={common.directParent.commonId}
          memberCount={common.memberCount}
          memberCircleIds={[common.directParent.circleId]}
          onSuccessfulLeave={handleSuccessfulProjectLeave}
          subCommonId={common.id}
          isSubCommon
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
        isShowing={
          (isJoinAllowed && isCommonJoinModalOpen) ||
          shouldKeepShowingCommonJoinModal
        }
        onClose={handleCommonJoinModalClose}
        common={common}
        governance={governance}
        shouldShowLoadingAfterSuccessfulCreation={
          governance.proposals[ProposalsTypes.MEMBER_ADMITTANCE]?.global
            .votingDuration === 0
        }
        onRequestCreated={handleCommonJoinRequestCreated}
      />
      <JoinProjectModal
        isShowing={
          (isJoinAllowed && isProjectJoinModalOpen) ||
          shouldKeepShowingProjectJoinModal
        }
        onClose={handleProjectJoinModalClose}
        common={common}
        governance={governance}
        shouldKeepLoadingIfPossible
        onRequestCreated={handleProjectJoinRequestCreated}
      />
    </CommonDataContext.Provider>
  );
};

export default CommonData;
