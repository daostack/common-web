import React, { FC } from "react";
import { BoldPlusIcon, PlusIcon } from "@/shared/icons";
import { ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import styles from "./PlusButton.module.scss";

interface PlusButtonProps {
  className?: string;
  isMobileVersion?: boolean;
  onClick?: () => void;
}

const PlusButton: FC<PlusButtonProps> = (props) => {
  const { className, isMobileVersion, onClick } = props;

  return (
    <ButtonIcon
      className={className}
      variant={
        isMobileVersion ? ButtonVariant.Transparent : ButtonVariant.PrimaryGray
      }
      onClick={onClick}
    >
      {isMobileVersion ? (
        <PlusIcon className={styles.icon} />
      ) : (
        <BoldPlusIcon className={styles.icon} />
      )}
    </ButtonIcon>
  );
};

export default PlusButton;
