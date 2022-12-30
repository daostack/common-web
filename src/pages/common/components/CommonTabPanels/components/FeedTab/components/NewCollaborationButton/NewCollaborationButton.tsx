import React, { FC } from "react";
import { BoldPlusIcon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./NewCollaborationButton.module.scss";

interface NewCollaborationButtonProps {
  isIconVersion?: boolean;
}

const NewCollaborationButton: FC<NewCollaborationButtonProps> = (props) => {
  const { isIconVersion = false } = props;
  const icon = <BoldPlusIcon className={styles.icon} />;
  const buttonVariant = ButtonVariant.OutlineBlue;

  if (isIconVersion) {
    return <ButtonIcon variant={buttonVariant}>{icon}</ButtonIcon>;
  }

  return (
    <Button variant={buttonVariant} size={ButtonSize.Xsmall} leftIcon={icon}>
      New Collaboration
    </Button>
  );
};

export default NewCollaborationButton;
