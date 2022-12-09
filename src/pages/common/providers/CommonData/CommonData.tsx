import React, { FC, useMemo, useState } from "react";
import { LeaveCommonModal } from "@/pages/OldCommon/components/CommonDetailContainer/LeaveCommonModal";
import { CirclesPermissions, Common, CommonMember } from "@/shared/models";
import { CommonMenuItem } from "../../constants";
import { CommonDataContext, CommonDataContextValue } from "./context";

interface CommonDataProps {
  common: Common;
  commonMember: (CommonMember & CirclesPermissions) | null;
}

const CommonData: FC<CommonDataProps> = (props) => {
  const { common, commonMember, children } = props;
  const [selectedMenuItem, setSelectedMenuItem] =
    useState<CommonMenuItem | null>(null);

  const handleMenuClose = () => {
    setSelectedMenuItem(null);
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
        />
      )}
    </CommonDataContext.Provider>
  );
};

export default CommonData;
