import React, { FC } from "react";
import { Billing } from "@/pages/MyAccount/components/Billing";
import { Container, PureCommonTopNavigation } from "@/shared/ui-kit";
import styles from "./Billing.module.scss";

const BillingPage: FC = () => {
  return (
    <>
      <PureCommonTopNavigation className={styles.topNavigation} />
      <Container className={styles.container}>
        <Billing />
      </Container>
    </>
  );
};

export default BillingPage;
