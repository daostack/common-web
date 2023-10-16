import React, { FC } from "react";
import { Billing } from "@/pages/MyAccount/components/Billing";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { RoutesV04Provider } from "@/shared/contexts";
import { Container } from "@/shared/ui-kit";
import styles from "./Billing.module.scss";

const BillingPage_v04: FC = () => {
  return (
    <RoutesV04Provider>
      <Container
        className={styles.container}
        viewports={[
          ViewportBreakpointVariant.Desktop,
          ViewportBreakpointVariant.Laptop,
        ]}
      >
        <Billing />
      </Container>
    </RoutesV04Provider>
  );
};

export default BillingPage_v04;
