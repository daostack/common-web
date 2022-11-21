import React, { FC } from "react";
import { useLocation } from "react-router";
import { SIDENAV_ID } from "@/shared/constants";
import { useLockedBody } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Footer, Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "./components";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const location = useLocation();
  const isTabletView = useIsTabletView();
  const isSidenavOpen = !isTabletView || location.hash === `#${SIDENAV_ID}`;
  const shouldLockBodyScroll = isTabletView && isSidenavOpen;
  useLockedBody(shouldLockBodyScroll);

  return (
    <div className={styles.container}>
      <Sidenav>
        <SidenavContent className={styles.sidenavContent} />
      </Sidenav>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default SidenavLayout;
