import React, { CSSProperties, FC, useCallback } from "react";
import { useWindowSize } from "react-use";
import classNames from "classnames";
import {
  CommonSidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { RoutesV04Provider } from "@/shared/contexts";
import { useLightThemeOnly, useLockedBody } from "@/shared/hooks";
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
  useLightThemeOnly();
  const { width } = useWindowSize();
  const { lockBodyScroll, unlockBodyScroll } = useLockedBody();
  const sidenavLeft = getSidenavLeft(width);
  const style = {
    "--sb-h-indent": `${sidenavLeft}px`,
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
        <RoutesV04Provider>
          <Sidenav
            contentWrapperClassName={styles.sidenavContentWrapper}
            style={{ left: sidenavLeft }}
            onOpenToggle={handleSidenavOpenToggle}
          >
            <SidenavContent className={styles.sidenavContent} />
          </Sidenav>
        </RoutesV04Provider>
      )}
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default CommonSidenavLayout;
