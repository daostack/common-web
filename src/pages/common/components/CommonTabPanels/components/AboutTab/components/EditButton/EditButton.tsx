import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { Edit2Icon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { getCommonEditingPagePath } from "@/shared/utils";
import styles from "./EditButton.module.scss";

interface EditButtonProps {
  isMobileVersion?: boolean;
  commonId: string;
}

const EditButton: FC<EditButtonProps> = (props) => {
  const { isMobileVersion = false, commonId } = props;
  const history = useHistory();
  const buttonVariant = ButtonVariant.OutlineDarkPink;
  const iconEl = <Edit2Icon className={styles.icon} />;

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
