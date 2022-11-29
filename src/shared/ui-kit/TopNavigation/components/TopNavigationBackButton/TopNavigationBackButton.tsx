import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { LongLeftArrowIcon } from "@/shared/icons";
import styles from "./TopNavigationBackButton.module.scss";

const TopNavigationBackButton: FC = () => (
  <ButtonIcon className={styles.button}>
    <LongLeftArrowIcon className={styles.icon} />
  </ButtonIcon>
);

export default TopNavigationBackButton;
