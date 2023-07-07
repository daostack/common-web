import React, { FC } from "react";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { checkIsSidenavOpen, closeSidenav } from "@/shared/utils";
import { MenuPopUp } from "../MenuPopUp";

interface MenuProps {
  a?: boolean;
}

const Menu: FC<MenuProps> = (props) => {
  const { a } = props;
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  const isSidenavOpen =
    viewportStates.isTabletView && checkIsSidenavOpen(queryParams);

  return <MenuPopUp isOpen={isSidenavOpen} onClose={closeSidenav} />;
};

export default Menu;
