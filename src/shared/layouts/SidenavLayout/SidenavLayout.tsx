import React, { FC, useCallback } from "react";
import classNames from "classnames";
import {
  SidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { RoutesV03Provider } from "@/shared/contexts";
import { useLightThemeOnly, useLockedBody } from "@/shared/hooks";
import { Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "./components";
import { checkSidenavVisibility } from "./utils";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<SidenavLayoutRouteOptions>();
  const isSidenavVisible = checkSidenavVisibility(routeOptions.sidenav);
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  useLightThemeOnly();

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
        <RoutesV03Provider>
          <Sidenav onOpenToggle={handleSidenavOpenToggle}>
            <SidenavContent className={styles.sidenavContent} />
          </Sidenav>
        </RoutesV03Provider>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default SidenavLayout;
