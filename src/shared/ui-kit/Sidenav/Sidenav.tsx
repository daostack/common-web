import React, { FC } from "react";
import { SIDENAV_ID } from "@/shared/constants";
import styles from "./Sidenav.module.scss";

const Sidenav: FC = (props) => {
  const { children } = props;

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
