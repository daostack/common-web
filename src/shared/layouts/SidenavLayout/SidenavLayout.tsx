import React, { FC } from "react";
import { Footer, Sidenav } from "@/shared/ui-kit";
import { SidenavContent } from "./components";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;

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
