import React, { CSSProperties, FC, KeyboardEvent, useEffect } from "react";
import classNames from "classnames";
import { SIDENAV_KEY } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useQueryParams } from "@/shared/hooks";
import { useAllViews } from "@/shared/hooks/viewport";
import { checkIsSidenavOpen, closeSidenav } from "@/shared/utils";
import styles from "./Sidenav.module.scss";

interface SidenavProps {
  className?: string;
  contentWrapperClassName?: string;
  style?: CSSProperties;
  isOpen?: boolean;
  shouldCheckViewportForOpenState?: boolean;
  withAnimation?: boolean;
  onOpenToggle?: (isOpen: boolean) => void;
}

const Sidenav: FC<SidenavProps> = (props) => {
  const {
    className,
    contentWrapperClassName,
    style,
    shouldCheckViewportForOpenState = true,
    withAnimation,
    onOpenToggle,
    children,
  } = props;
  const queryParams = useQueryParams();
  const viewportStates = useAllViews();
  // Sidenav can be open only on tablet and lower viewports if shouldCheckViewportForOpenState is `true`
  const isAllowedToBeShown =
    !shouldCheckViewportForOpenState || viewportStates.isTabletView;
  const isSidenavOpen =
    props.isOpen ?? (isAllowedToBeShown && checkIsSidenavOpen(queryParams));
  const isSidenavWithAnimation = withAnimation ?? viewportStates.isTabletView;

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
      className={classNames(
        styles.sidenav,
        {
          [styles.sidenavWithAnimation]: isSidenavWithAnimation,
          [styles.sidenavWithAnimationOpen]:
            isSidenavWithAnimation && isSidenavOpen,
        },
        className,
      )}
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
