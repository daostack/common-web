import React, { FC } from "react";
import { useLocation } from "react-router";
import { SIDENAV_ID } from "@/shared/constants";
import { useLockedBody } from "@/shared/hooks";
import { useIsTabletView } from "@/shared/hooks/viewport";
import styles from "./Sidenav.module.scss";

const Sidenav: FC = (props) => {
  const { children } = props;
  const location = useLocation();
  const isTabletView = useIsTabletView();
  const isSidenavOpen = !isTabletView || location.hash === `#${SIDENAV_ID}`;
  const shouldLockBodyScroll = isTabletView && isSidenavOpen;
  useLockedBody(shouldLockBodyScroll);

  return (
    <aside id={SIDENAV_ID} className={styles.sidenav}>
      <div className={styles.contentWrapper}>{children}</div>
      <a
        href="#"
        id="sidenav-close"
        className={styles.closeLink}
        title="Close Menu"
        aria-label="Close Menu"
      />
    </aside>
  );
};

export default Sidenav;
