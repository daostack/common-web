import React, { FC } from "react";
import { TopNavigation } from "@/shared/ui-kit";
import styles from "./CommonTopNavigation.module.scss";

const CommonTopNavigation: FC = () => {
  return <TopNavigation className={styles.container}>Content</TopNavigation>;
};

export default CommonTopNavigation;
