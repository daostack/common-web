import React, { FC, KeyboardEvent, useEffect } from "react";
import { useLocation } from "react-router";
import classNames from "classnames";
import { SIDENAV_ID } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useAllViews } from "@/shared/hooks/viewport";
import styles from "./Sidenav.module.scss";

interface SidenavProps {
  onOpenToggle?: (isOpen: boolean) => void;
}

const Sidenav: FC<SidenavProps> = (props) => {
  const { onOpenToggle, children } = props;
  const location = useLocation();
  const viewportStates = useAllViews();
  // Sidenav is always visible on desktop and on tablet and lower viewports when hash is as sidenav id
  const isSidenavVisible =
    !viewportStates.isTabletView || location.hash === `#${SIDENAV_ID}`;
  // Sidenav can be open only on tablet and lower viewports
  const isSidenavOpen = viewportStates.isTabletView && isSidenavVisible;

  const closeSidenav = () => {
    window.location.hash = "";
  };

  const onSidebarKeyUp = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === KeyboardKeys.Escape) {
      closeSidenav();
    }
  };

  useEffect(() => {
    if (onOpenToggle) {
      onOpenToggle(isSidenavOpen);
    }
  }, [isSidenavOpen]);

  return (
    <aside
      id={SIDENAV_ID}
      className={classNames(styles.sidenav, {
        [styles.sidenavOpen]: isSidenavOpen,
      })}
      onKeyUp={onSidebarKeyUp}
      tabIndex={0}
    >
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
