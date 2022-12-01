import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonGovernance.module.scss";

interface CommonGovernanceProps {
  commonName: string;
}

const CommonGovernance: FC<CommonGovernanceProps> = (props) => {
  const { commonName } = props;
  const isTabletView = useIsTabletView();

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard hideCardStyles={isTabletView}>
        <h3 className={styles.title}>Governance</h3>
        <p className={styles.description}>
          The various permissions for each circle in{" "}
          <strong>{commonName}</strong>, in terms of proposing and voting on
          various actions
        </p>
      </CommonCard>
    </Container>
  );
};

export default CommonGovernance;
