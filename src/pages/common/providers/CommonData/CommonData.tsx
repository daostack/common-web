import React, { FC, useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { CommonMemberEventEmitter } from "@/events";
import {
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
import { CommonDataContext, CommonDataContextValue } from "./context";
import { useProposalCreationModal } from "./hooks";

interface CommonDataProps {
  common: Common;
  governance: Governance;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const CommonData: FC<CommonDataProps> = (props) => {
  const { common, governance, commonMember, children } = props;
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
    }),
    [handleMenuItemSelect],
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
          activeProposalsExist={true}
          redirectToProposal={redirectToProposalPage}
          initialProposalType={initialProposalTypeForCreation}
        />
      )}
    </CommonDataContext.Provider>
  );
};

export default CommonData;
