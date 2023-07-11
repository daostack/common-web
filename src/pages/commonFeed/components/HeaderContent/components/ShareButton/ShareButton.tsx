import React, { FC } from "react";
import { Share2Icon } from "@/shared/icons";
import { ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import styles from "./ShareButton.module.scss";

interface ShareButtonProps {
  onClick: () => void;
}

const ShareButton: FC<ShareButtonProps> = (props) => {
  const { onClick } = props;

  return (
    <ButtonIcon variant={ButtonVariant.PrimaryGray} onClick={onClick}>
      <Share2Icon className={styles.icon} />
    </ButtonIcon>
  );
};

export default ShareButton;
