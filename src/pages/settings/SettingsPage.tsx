import React, { FC } from "react";
import { MainRoutesProvider } from "@/shared/contexts";
import { Container } from "@/shared/ui-kit";
import { Settings } from "./components";
import styles from "./SettingsPage.module.scss";

const SettingsPage: FC = () => {
  return (
    <MainRoutesProvider>
      <Container className={styles.container}>
        <Settings />
      </Container>
    </MainRoutesProvider>
  );
};

export default SettingsPage;
