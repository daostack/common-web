import React, { FC } from "react";
import { useModal } from "@/shared/hooks";
import { Message2Icon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { DirectMessageModal } from "./components";
import styles from "./DirectMessageButton.module.scss";

interface DirectMessageButtonProps {
  className?: string;
  isMobileVersion?: boolean;
  isHidden?: boolean;
}

const DirectMessageButton: FC<DirectMessageButtonProps> = (props) => {
  const { className, isMobileVersion = false, isHidden = false } = props;
  const {
    isShowing: isDirectMessageModalOpen,
    onOpen: onDirectMessageModalOpen,
    onClose: onDirectMessageModalClose,
  } = useModal(false);
  const buttonVariant = ButtonVariant.OutlineDarkPink;
  const iconEl = <Message2Icon className={styles.icon} />;
  const buttonEl = isMobileVersion ? (
    <ButtonIcon
      className={className}
      variant={buttonVariant}
      onClick={onDirectMessageModalOpen}
    >
      {iconEl}
    </ButtonIcon>
  ) : (
    <Button
      className={className}
      variant={buttonVariant}
      size={ButtonSize.Xsmall}
      leftIcon={iconEl}
      onClick={onDirectMessageModalOpen}
    >
      Direct message
    </Button>
  );

  if (isHidden) {
    return null;
  }

  return (
    <>
      {buttonEl}
      <DirectMessageModal
        isOpen={isDirectMessageModalOpen}
        onClose={onDirectMessageModalClose}
        isMobileVersion={isMobileVersion}
      />
    </>
  );
};

export default DirectMessageButton;
