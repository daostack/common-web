import React, { FC } from "react";
import { MenuItem } from "@/shared/interfaces";
import { DesktopCommonDropdown } from "./components";

interface CommonDropdownProps {
  items: MenuItem[];
  activeItemId?: string | null;
  isActive: boolean;
  menuItemsClassName?: string;
}

const CommonDropdown: FC<CommonDropdownProps> = (props) => {
  const { items, activeItemId, isActive, menuItemsClassName } = props;

  return (
    <DesktopCommonDropdown
      items={items}
      activeItemId={activeItemId}
      isActive={isActive}
      menuItemsClassName={menuItemsClassName}
    />
  );
};

export default CommonDropdown;
