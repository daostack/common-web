import React, { FC } from "react";
import { RoutesV04Provider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import { Settings } from "./components";
import styles from "./SettingsPage.module.scss";

const SettingsPage_v04: FC = () => {
  return (
    <RoutesV04Provider>
      <Container className={styles.container}>
        <Settings />
      </Container>
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </RoutesV04Provider>
  );
};

export default SettingsPage_v04;
