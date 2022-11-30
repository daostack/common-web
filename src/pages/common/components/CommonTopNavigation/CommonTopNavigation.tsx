import React, { FC } from "react";
import { TopNavigation, TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import styles from "./CommonTopNavigation.module.scss";

const CommonTopNavigation: FC = () => {
  return (
    <TopNavigation className={styles.container}>
      <TopNavigationOpenSidenavButton />
    </TopNavigation>
  );
};

export default CommonTopNavigation;
