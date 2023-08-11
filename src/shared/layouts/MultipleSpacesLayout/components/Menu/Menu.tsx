import React, { FC, ReactNode, useCallback } from "react";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { checkIsSidenavOpen, closeSidenav } from "@/shared/utils";
import { Projects } from "../../../CommonSidenavLayout/components/SidenavContent/components";
import useGoToCreateCommon from "../../hooks";
import { MenuPopUp } from "../MenuPopUp";
import styles from "./Menu.module.scss";

const Menu: FC = () => {
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  const goToCreateCommon = useGoToCreateCommon();
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
          onClick={goToCreateCommon}
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
      <Projects
        renderNoItemsInfo={renderNoItemsInfo}
        onCommonCreationClick={goToCreateCommon}
      />
    </MenuPopUp>
  );
};

export default Menu;
