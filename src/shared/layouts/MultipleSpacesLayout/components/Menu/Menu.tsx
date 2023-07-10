import React, { FC, ReactNode, useCallback, useRef } from "react";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { checkIsSidenavOpen, closeSidenav } from "@/shared/utils";
import {
  Projects,
  ProjectsRef,
} from "../../../CommonSidenavLayout/components/SidenavContent/components";
import { MenuPopUp } from "../MenuPopUp";
import styles from "./Menu.module.scss";

const Menu: FC = () => {
  const projectsRef = useRef<ProjectsRef>(null);
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  const isSidenavOpen =
    viewportStates.isTabletView && checkIsSidenavOpen(queryParams);

  const renderNoItemsInfo = useCallback((): ReactNode => {
    return (
      <div className={styles.noCommonsInfoContainer}>
        <p className={styles.noCommonsText}>
          You do not have spaces yet. You might want to create a new common or
          ask your friends for the link to an existing one.
        </p>
        <Button
          className={styles.createCommonButton}
          variant={ButtonVariant.PrimaryPink}
          onClick={projectsRef.current?.openCreateCommonModal}
        >
          Create common
        </Button>
      </div>
    );
  }, []);

  return (
    <MenuPopUp
      isOpen={isSidenavOpen}
      onClose={closeSidenav}
      modalContentClassName={styles.modalContent}
    >
      <Projects ref={projectsRef} renderNoItemsInfo={renderNoItemsInfo} />
    </MenuPopUp>
  );
};

export default Menu;
