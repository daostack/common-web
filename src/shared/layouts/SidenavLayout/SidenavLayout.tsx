import React, { FC } from "react";
import { useLocation } from "react-router";
import classNames from "classnames";
import {
  SidenavLayoutRouteOptions,
  useLayoutRouteContext,
} from "@/pages/App/router";
import { SIDENAV_ID } from "@/shared/constants";
import { useLockedBody } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { Footer, Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "./components";
import { checkFooterVisibility } from "./utils";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const { routeOptions = {} } =
    useLayoutRouteContext<SidenavLayoutRouteOptions>();
  const location = useLocation();
  const viewportStates = useAllViews();
  const isFooterVisible = checkFooterVisibility(
    routeOptions.footer,
    viewportStates,
  );
  const isSidenavOpen =
    !viewportStates.isTabletView || location.hash === `#${SIDENAV_ID}`;
  const shouldLockBodyScroll = viewportStates.isTabletView && isSidenavOpen;
  useLockedBody(shouldLockBodyScroll);

  return (
    <div
      className={classNames(styles.container, {
        [styles.containerWithoutFooter]: !isFooterVisible,
      })}
    >
      <Sidenav>
        <SidenavContent className={styles.sidenavContent} />
      </Sidenav>
      <main className={styles.main}>{children}</main>
      {isFooterVisible && <Footer />}
    </div>
  );
};

export default SidenavLayout;
