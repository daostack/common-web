import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MoreIcon } from "@/shared/icons";
import styles from "./CommonMenuButton.module.scss";

interface CommonMenuButtonProps {
  className?: string;
}

const CommonMenuButton: FC<CommonMenuButtonProps> = (props) => {
  const { className } = props;

  return (
    <ButtonIcon className={className}>
      <MoreIcon className={styles.icon} />
    </ButtonIcon>
  );
};

export default CommonMenuButton;
