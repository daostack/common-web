import React, { FC } from "react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { Common } from "@/shared/models";
import { CommonDescription } from "./components";
import styles from "./AboutTab.module.scss";

interface AboutTabProps {
  common: Common;
}

const AboutTab: FC<AboutTabProps> = (props) => {
  const { common } = props;
  const isTabletView = useIsTabletView();

  const renderMainColumn = () => (
    <div className={styles.mainColumnWrapper}>
      <CommonDescription common={common} />
    </div>
  );

  const renderAdditionalColumn = () => {
    if (isTabletView) {
      return null;
    }

    return <div className={styles.additionalColumnWrapper}></div>;
  };

  return (
    <div>
      <div className={styles.columnsWrapper}>
        {renderMainColumn()}
        {renderAdditionalColumn()}
      </div>
    </div>
  );
};

export default AboutTab;
