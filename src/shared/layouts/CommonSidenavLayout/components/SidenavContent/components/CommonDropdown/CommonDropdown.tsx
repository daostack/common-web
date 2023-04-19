import React, { FC } from "react";
import { MenuItem } from "@/shared/interfaces";
import { DesktopCommonDropdown } from "./components";

interface CommonDropdownProps {
  items: MenuItem[];
  activeItemId?: string | null;
  isActive: boolean;
}

const CommonDropdown: FC<CommonDropdownProps> = (props) => {
  const { items, activeItemId, isActive } = props;

  return (
    <DesktopCommonDropdown
      items={items}
      activeItemId={activeItemId}
      isActive={isActive}
    />
  );
};

export default CommonDropdown;
