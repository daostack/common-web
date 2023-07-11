import React, { FC } from "react";
import { Billing } from "@/pages/MyAccount/components/Billing";
import { MainRoutesProvider } from "@/shared/contexts";
import { Container, PureCommonTopNavigation } from "@/shared/ui-kit";
import styles from "./Billing.module.scss";

const BillingPage: FC = () => {
  return (
    <MainRoutesProvider>
      <PureCommonTopNavigation className={styles.topNavigation} />
      <Container className={styles.container}>
        <Billing />
      </Container>
    </MainRoutesProvider>
  );
};

export default BillingPage;
