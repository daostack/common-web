import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { RoutesV04Provider } from "@/shared/contexts";
import { Container } from "@/shared/ui-kit";
import { Settings } from "./components";
import styles from "./SettingsPage.module.scss";

const SettingsPage_v04: FC = () => {
  return (
    <RoutesV04Provider>
      <Container
        className={styles.container}
        viewports={[
          ViewportBreakpointVariant.Desktop,
          ViewportBreakpointVariant.Laptop,
        ]}
      >
        <Settings />
      </Container>
    </RoutesV04Provider>
  );
};

export default SettingsPage_v04;
