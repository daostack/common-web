import React, { FC } from "react";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import styles from "./PureCommonTopNavigation.module.scss";

const PureCommonTopNavigation: FC = () => (
  <TopNavigation className={styles.container}>
    <TopNavigationOpenSidenavButton />
  </TopNavigation>
);

export default PureCommonTopNavigation;
