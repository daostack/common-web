import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { InviteFriendsIcon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { getCommonEditingPagePath } from "@/shared/utils";
import styles from "./EditButton.module.scss";

interface EditButtonProps {
  isMobileVersion?: boolean;
  commonId: string;
  isProject?: boolean;
}

const EditButton: FC<EditButtonProps> = (props) => {
  const { isMobileVersion = false, commonId, isProject = false } = props;
  const history = useHistory();
  const buttonVariant = ButtonVariant.OutlineBlue;
  const iconEl = <InviteFriendsIcon className={styles.icon} />;

  if (!isProject) {
    return null;
  }

  const handleClick = () => {
    history.push(getCommonEditingPagePath(commonId));
  };

  return isMobileVersion ? (
    <ButtonIcon onClick={handleClick} variant={buttonVariant}>
      {iconEl}
    </ButtonIcon>
  ) : (
    <Button
      onClick={handleClick}
      variant={buttonVariant}
      size={ButtonSize.Xsmall}
      leftIcon={iconEl}
    >
      Edit
    </Button>
  );
};

export default EditButton;
