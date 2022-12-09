import React, { FC, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { LeaveCommonModal } from "@/pages/OldCommon/components/CommonDetailContainer/LeaveCommonModal";
import { useNotification } from "@/shared/hooks";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { projectsActions } from "@/store/states";
import { CommonMenuItem } from "../../constants";
import { CommonDataContext, CommonDataContextValue } from "./context";

interface CommonDataProps {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const CommonData: FC<CommonDataProps> = (props) => {
  const { common, commonMember, children } = props;
  const dispatch = useDispatch();
  const { notify } = useNotification();
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<CommonMenuItem | null>(null);

  const handleMenuClose = () => {
    setSelectedMenuItem(null);
  };

  const handleSuccessfulLeave = () => {
    dispatch(projectsActions.removeMembershipFromProjectAndChildren(common.id));
    notify("You’ve successfully left the common");
    handleMenuClose();
  };

  const contextValue = useMemo<CommonDataContextValue>(
    () => ({
      onMenuItemSelect: setSelectedMenuItem,
    }),
    [],
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
    </CommonDataContext.Provider>
  );
};

export default CommonData;
