import React, { FC, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonMemberEventEmitter } from "@/events";
import {
  CreateCommonModal,
  CreateProposalModal,
  LeaveCommonModal,
} from "@/pages/OldCommon/components";
import { useNotification } from "@/shared/hooks";
import {
  CirclesPermissions,
  Common,
  CommonMember,
  Governance,
} from "@/shared/models";
import { projectsActions } from "@/store/states";
import { CommonMenuItem } from "../../constants";
import { LeaveCircleModal } from "./components";
import { CommonDataContext, CommonDataContextValue } from "./context";
import {
  useLeaveCommonModal,
  useProposalCreationModal,
  useSubCommonCreationModal,
} from "./hooks";

interface CommonDataProps {
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
  subCommons: Common[];
}

const CommonData: FC<CommonDataProps> = (props) => {
  const { common, governance, commonMember, subCommons, children } = props;
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
    isLeaveCommonModalOpen,
    onLeaveCommonModalOpen,
    onLeaveCommonModalClose,
  } = useLeaveCommonModal();

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
      CommonMemberEventEmitter.emit(`clear-common-member-${commonMember.id}`);
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
    }),
    [
      handleMenuItemSelect,
      areNonCreatedProjectsLeft,
      onSubCommonCreationModalOpen,
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
      <LeaveCircleModal
        isShowing={isLeaveCommonModalOpen}
        onClose={onLeaveCommonModalClose}
      />
    </CommonDataContext.Provider>
  );
};

export default CommonData;
