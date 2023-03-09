import React, { FC } from "react";
import { useHistory } from "react-router-dom";
import { BoldPlusIcon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import { getCommonSupportPagePath } from "@/shared/utils";
import styles from "./NewContributionButton.module.scss";

interface NewContributionButtonProps {
  isMobileVersion?: boolean;
  commonId: string;
}

const NewContributionButton: FC<NewContributionButtonProps> = (props) => {
  const { isMobileVersion = false, commonId } = props;
  const history = useHistory();
  const buttonVariant = ButtonVariant.OutlineBlue;
  const iconEl = <BoldPlusIcon className={styles.icon} />;

  const handleClick = () => {
    history.push(getCommonSupportPagePath(commonId));
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
      New Contribution
    </Button>
  );
};

export default NewContributionButton;
