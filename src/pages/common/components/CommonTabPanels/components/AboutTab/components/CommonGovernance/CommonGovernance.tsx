import React, { FC } from "react";
import { ViewportBreakpointVariant } from "@/shared/constants";
import { useIsTabletView } from "@/shared/hooks/viewport";
import NewTabIcon from "@/shared/icons/newtab.icon";
import { Container } from "@/shared/ui-kit";
import { CommonCard } from "../../../../../CommonCard";
import styles from "./CommonGovernance.module.scss";

interface CommonGovernanceProps {
  commonName: string;
  titleUrl?: string;
}

const CommonGovernance: FC<CommonGovernanceProps> = (props) => {
  const { commonName, titleUrl } = props;
  const isTabletView = useIsTabletView();
  const titleText = "Governance";

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard hideCardStyles={isTabletView}>
        <h3 className={styles.title}>
          {titleUrl ? (
            <a href={titleUrl} target="_blank" className={styles.titleLink}>
              {titleText}
              <NewTabIcon className={styles.newTabIcon} />
            </a>
          ) : (
            titleText
          )}
        </h3>
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
