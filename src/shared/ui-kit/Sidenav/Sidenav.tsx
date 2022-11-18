import React, { FC, KeyboardEvent } from "react";
import { SIDENAV_ID } from "@/shared/constants";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import styles from "./Sidenav.module.scss";

const Sidenav: FC = (props) => {
  const { children } = props;

  const closeSidenav = () => {
    window.location.hash = "";
  };

  const onSidebarKeyUp = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === KeyboardKeys.Escape) {
      closeSidenav();
    }
  };

  return (
    <aside
      id={SIDENAV_ID}
      className={styles.sidenav}
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
