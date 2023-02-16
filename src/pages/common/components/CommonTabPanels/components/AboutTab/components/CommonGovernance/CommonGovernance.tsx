import React, { FC } from "react";
import classNames from "classnames";
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

  return (
    <Container
      viewports={[
        ViewportBreakpointVariant.Tablet,
        ViewportBreakpointVariant.PhoneOriented,
        ViewportBreakpointVariant.Phone,
      ]}
    >
      <CommonCard hideCardStyles={isTabletView}>
        <h3
          className={classNames(styles.title, { [styles.link]: titleUrl })}
          onClick={() => titleUrl && window.open(titleUrl)}
        >
          Governance {titleUrl && <NewTabIcon className={styles.newTabIcon} />}
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
