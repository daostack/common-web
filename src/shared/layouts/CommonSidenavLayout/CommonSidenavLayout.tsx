import React, { CSSProperties, FC, useCallback } from "react";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  CommonSidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { useLockedBody } from "@/shared/hooks";
import { Sidenav } from "@/shared/ui-kit";
import { checkSidenavVisibility } from "../SidenavLayout/utils";
import { SidenavContent } from "./components";
import { getSidenavLeft } from "./utils";
import styles from "./CommonSidenavLayout.module.scss";

const CommonSidenavLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<CommonSidenavLayoutRouteOptions>();
  const isSidenavVisible = checkSidenavVisibility(routeOptions.sidenav);
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-left": `${sidenavLeft}px`,
  } as CSSProperties;

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
      style={style}
    >
      {isSidenavVisible && (
        <Sidenav
          style={{ left: sidenavLeft }}
          onOpenToggle={handleSidenavOpenToggle}
        >
          <SidenavContent className={styles.sidenavContent} />
        </Sidenav>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CommonSidenavLayout;
