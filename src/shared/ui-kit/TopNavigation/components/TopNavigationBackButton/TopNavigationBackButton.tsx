import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { Hamburger2Icon } from "@/shared/icons";
import styles from "./TopNavigationBackButton.module.scss";

interface TopNavigationBackButtonProps {
  onClick: () => void;
}

const TopNavigationBackButton: FC<TopNavigationBackButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <ButtonIcon className={styles.button} onClick={onClick}>
      <Hamburger2Icon className={styles.icon} />
    </ButtonIcon>
  );
};

export default TopNavigationBackButton;
