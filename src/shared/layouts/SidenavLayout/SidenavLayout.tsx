import React, { FC, useState } from "react";
import { SIDENAV_ID } from "@/shared/constants";
import { Footer, Sidenav } from "@/shared/ui-kit";
import styles from "./SidenavLayout.module.scss";

const SidenavLayout: FC = (props) => {
  const { children } = props;
  const [amountOfBlocks, setAmountOfBlocks] = useState(3);

  return (
    <div className={styles.container}>
      <Sidenav>
        <div className={styles.customSidenavContent}>
          {Array(amountOfBlocks)
            .fill(null)
            .map((item, index) => (
              <React.Fragment key={index}>
                <h4>My</h4>
                <a href="#">Dashboard</a>
                <a href="#">Profile</a>
                <a href="#">Preferences</a>
                <a href="#">Archive</a>
              </React.Fragment>
            ))}
          <button
            onClick={() =>
              setAmountOfBlocks((currentAmount) => currentAmount + 1)
            }
          >
            Add block
          </button>
          <a href="#">Close Sidenav</a>
        </div>
      </Sidenav>
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default SidenavLayout;
