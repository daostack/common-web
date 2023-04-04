import React, { FC } from "react";
import { MenuItem } from "@/shared/interfaces";
import { DesktopCommonDropdown } from "./components";

interface CommonDropdownProps {
  items: MenuItem[];
  activeItemId?: string | null;
}

const CommonDropdown: FC<CommonDropdownProps> = (props) => {
  const { items, activeItemId } = props;

  return <DesktopCommonDropdown items={items} activeItemId={activeItemId} />;
};

export default CommonDropdown;
