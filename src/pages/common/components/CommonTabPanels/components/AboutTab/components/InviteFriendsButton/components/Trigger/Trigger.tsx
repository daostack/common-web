import React, { FC } from "react";
import { InviteFriendsIcon, ShareIcon } from "@/shared/icons";
import { Button, ButtonIcon, ButtonSize, ButtonVariant } from "@/shared/ui-kit";
import styles from "./Trigger.module.scss";

export interface TriggerProps {
  onClick: () => void;
  isMobileVersion?: boolean;
}

const Trigger: FC<TriggerProps> = (props) => {
  const { isMobileVersion, onClick } = props;
  const buttonVariant = ButtonVariant.OutlineDarkPink;
  const iconEl = <InviteFriendsIcon className={styles.icon} />;

  return isMobileVersion ? (
    <ButtonIcon onClick={onClick} variant={buttonVariant}>
      <ShareIcon className={styles.icon} />
    </ButtonIcon>
  ) : (
    <Button
      onClick={onClick}
      variant={buttonVariant}
      size={ButtonSize.Xsmall}
      leftIcon={iconEl}
    >
      Invite friends
    </Button>
  );
};

export default Trigger;
