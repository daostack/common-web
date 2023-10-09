import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import { Container } from "@/shared/ui-kit";
import { Settings } from "./components";
import styles from "./SettingsPage.module.scss";

const SettingsPage: FC = () => {
  return (
    <MainRoutesProvider>
      <Container className={styles.container}>
        <Settings />
      </Container>
      <CommonSidenavLayoutTabs className={styles.tabs} />
    </MainRoutesProvider>
  );
};

export default SettingsPage;
