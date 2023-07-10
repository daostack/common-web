import React, { FC } from "react";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { checkIsSidenavOpen, closeSidenav } from "@/shared/utils";
import { Projects } from "../../../CommonSidenavLayout/components/SidenavContent/components";
import { MenuPopUp } from "../MenuPopUp";
import styles from "./Menu.module.scss";

const Menu: FC = () => {
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  const isSidenavOpen =
    viewportStates.isTabletView && checkIsSidenavOpen(queryParams);

  return (
    <MenuPopUp
      isOpen={isSidenavOpen}
      onClose={closeSidenav}
      modalContentClassName={styles.modalContent}
    >
      <Projects />
    </MenuPopUp>
  );
};

export default Menu;
