import React, { FC } from "react";
import classnames from "classnames";
import { PlusIcon } from "@/shared/icons";
import { ButtonIcon } from "@/shared/ui-kit";
import styles from "./PlusButton.module.scss";

interface PlusButtonProps {
  className?: string;
  onClick?: () => void;
}

const PlusButton: FC<PlusButtonProps> = (props) => {
  const { className, onClick } = props;

  return (
    <ButtonIcon
      className={classnames(styles.buttonIcon, className)}
      onClick={onClick}
    >
      <PlusIcon className={styles.icon} />
    </ButtonIcon>
  );
};

export default PlusButton;
