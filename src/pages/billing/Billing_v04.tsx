import React, { FC } from "react";
import { Billing } from "@/pages/MyAccount/components/Billing";
import { RoutesV04Provider } from "@/shared/contexts";
import { Container, PureCommonTopNavigation } from "@/shared/ui-kit";
import styles from "./Billing.module.scss";

const BillingPage_v04: FC = () => {
  return (
    <RoutesV04Provider>
      <PureCommonTopNavigation className={styles.topNavigation} />
      <Container className={styles.container}>
        <Billing />
      </Container>
    </RoutesV04Provider>
  );
};

export default BillingPage_v04;
