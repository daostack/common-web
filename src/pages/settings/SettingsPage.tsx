import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { Container } from "@/shared/ui-kit";
import { Settings } from "./components";
import styles from "./SettingsPage.module.scss";

const SettingsPage: FC = () => {
  return (
    <MainRoutesProvider>
      <Container
        className={styles.container}
        viewports={[
          ViewportBreakpointVariant.Desktop,
          ViewportBreakpointVariant.Laptop,
        ]}
      >
        <Settings />
      </Container>
    </MainRoutesProvider>
  );
};

export default SettingsPage;
