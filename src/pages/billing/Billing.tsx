import React, { FC } from "react";
import { Billing } from "@/pages/MyAccount/components/Billing";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { MainRoutesProvider } from "@/shared/contexts";
import { Container } from "@/shared/ui-kit";
import styles from "./Billing.module.scss";

const BillingPage: FC = () => {
  return (
    <MainRoutesProvider>
      <Container
        className={styles.container}
        viewports={[
          ViewportBreakpointVariant.Desktop,
          ViewportBreakpointVariant.Laptop,
        ]}
      >
        <Billing />
      </Container>
    </MainRoutesProvider>
  );
};

export default BillingPage;
