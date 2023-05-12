import React, { FC } from "react";
import { Message2Icon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./DirectMessageButton.module.scss";

interface DirectMessageButtonProps {
  className?: string;
  isMobileVersion?: boolean;
}

const DirectMessageButton: FC<DirectMessageButtonProps> = (props) => {
  const { className, isMobileVersion = false } = props;
  const buttonVariant = ButtonVariant.OutlineDarkPink;
  const iconEl = <Message2Icon className={styles.icon} />;

  if (!isMobileVersion) {
    return (
      <Button
        className={className}
        variant={buttonVariant}
        size={ButtonSize.Xsmall}
        leftIcon={iconEl}
      >
        Direct message
      </Button>
    );
  }

  return (
    <ButtonIcon className={className} variant={buttonVariant}>
      {iconEl}
    </ButtonIcon>
  );
};

export default DirectMessageButton;
