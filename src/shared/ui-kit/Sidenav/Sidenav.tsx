import React, { CSSProperties, FC, KeyboardEvent, useEffect } from "react";
import classNames from "classnames";
import { SIDENAV_KEY, SIDENAV_OPEN } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import styles from "./Sidenav.module.scss";

interface SidenavProps {
  contentWrapperClassName?: string;
  style?: CSSProperties;
  onOpenToggle?: (isOpen: boolean) => void;
}

const Sidenav: FC<SidenavProps> = (props) => {
  const { contentWrapperClassName, style, onOpenToggle, children } = props;
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  const isSidenavVisible =
    !viewportStates.isTabletView || queryParams[SIDENAV_KEY] === SIDENAV_OPEN;
  // Sidenav can be open only on tablet and lower viewports
  const isSidenavOpen = viewportStates.isTabletView && isSidenavVisible;

  const closeSidenav = () => {
    window.location.search = "";
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
      id={SIDENAV_KEY}
      className={classNames(styles.sidenav, {
        [styles.sidenavOpen]: isSidenavOpen,
      })}
      style={style}
      onKeyUp={onSidebarKeyUp}
      tabIndex={0}
    >
      <div
        className={classNames(styles.contentWrapper, contentWrapperClassName)}
      >
        {children}
      </div>
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
