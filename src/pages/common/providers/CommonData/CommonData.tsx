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
import { useRoutesContext } from "@/shared/contexts";
import { useAuthorizedModal, useNotification } from "@/shared/hooks";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
  SupportersData,
} from "@/shared/models";
import { checkIsProject, getProjectCreationPagePath } from "@/shared/utils";
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
  rootCommonMember: CommonMember | null;
  parentCommonMember: CommonMember | null;
  isGlobalDataFetched: boolean;
  parentCommons: Common[];
  subCommons: Common[];
  rootCommon: Common | null;
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
    rootCommonMember,
    parentCommonMember,
    isGlobalDataFetched,
    parentCommons,
    subCommons,
    rootCommon,
    parentCommon,
    parentCommonSubCommons,
    supportersData,
    setIsJoinPending,
    children,
  } = props;
  const dispatch = useDispatch();
  const history = useHistory();
  const { notify } = useNotification();
  const { getCommonPagePath } = useRoutesContext();
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
  const isProject = checkIsProject(common);

  const isJoinPending =
    isGlobalDataFetched && !commonMember && props.isJoinPending;
  const isJoinAllowed = Boolean(
    isGlobalDataFetched &&
      rootCommonMember &&
      parentCommonMember &&
      !isJoinPending &&
      ((!isProject && !commonMember) ||
        (isProject && parentCommonMember && !commonMember)),
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
  }, [
    shouldRedirectToFeedOnCommonMemberExistence,
    commonMember,
    getCommonPagePath,
  ]);

  const contextValue = useMemo<CommonDataContextValue>(
    () => ({
      settings,
      onMenuItemSelect: handleMenuItemSelect,
      onProjectCreate: handleProjectCreate,
      common,
      commonMember,
      governance,
      parentCommons,
      subCommons,
      rootCommon,
      rootCommonMember,
      parentCommon,
      parentCommonMember,
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
      commonMember,
      governance,
      parentCommons,
      subCommons,
      rootCommon,
      rootCommonMember,
      parentCommon,
      parentCommonMember,
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
          isShowing={Boolean(
            selectedMenuItem &&
              [
                CommonMenuItem.LeaveCommon,
                CommonMenuItem.LeaveProject,
              ].includes(selectedMenuItem),
          )}
          onClose={handleMenuClose}
          commonId={common.id}
          memberCount={common.memberCount}
          memberCircleIds={Object.values(commonMember.circles.map)}
          onSuccessfulLeave={
            selectedMenuItem === CommonMenuItem.LeaveProject
              ? handleSuccessfulProjectLeave
              : handleSuccessfulLeave
          }
          isSubCommon={selectedMenuItem === CommonMenuItem.LeaveProject}
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
        onRequestCreated={handleCommonJoinRequestCreated}
        showLoadingAfterSuccessfulCreation
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
