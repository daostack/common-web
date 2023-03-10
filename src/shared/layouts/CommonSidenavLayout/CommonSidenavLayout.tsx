import React, { FC, useCallback } from "react";
import classNames from "classnames";
import {
  CommonSidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { useLockedBody } from "@/shared/hooks";
import { Sidenav } from "@/shared/ui-kit";
import { checkSidenavVisibility } from "../SidenavLayout/utils";
import styles from "./CommonSidenavLayout.module.scss";

const CommonSidenavLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<CommonSidenavLayoutRouteOptions>();
  const isSidenavVisible = checkSidenavVisibility(routeOptions.sidenav);
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();

  const handleSidenavOpenToggle = useCallback(
    (isOpen: boolean) => {
      if (isOpen) {
        lockBodyScroll();
      } else {
        unlockBodyScroll();
      }
    },
    [lockBodyScroll, unlockBodyScroll],
  );

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerWithSidenav]: isSidenavVisible,
      })}
    >
      {isSidenavVisible && (
        <Sidenav onOpenToggle={handleSidenavOpenToggle}>
          <div className={styles.sidenavContent}>Sidenav content</div>
        </Sidenav>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CommonSidenavLayout;
