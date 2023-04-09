import React, { FC, MouseEventHandler } from "react";
import classNames from "classnames";
import { StarIcon } from "@/shared/icons";
import { ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import styles from "./FollowFeedItemButton.module.scss";

interface FollowFeedItemButtonProps {
  isFollowing?: boolean;
  onClick?: MouseEventHandler;
}

const FollowFeedItemButton: FC<FollowFeedItemButtonProps> = (props) => {
  const { isFollowing = false, onClick } = props;

  return (
    <ButtonIcon
      className={styles.button}
      variant={ButtonVariant.OutlinePink}
      onClick={onClick}
    >
      <StarIcon
        className={classNames(styles.icon, {
          [styles.iconFilled]: isFollowing,
        })}
      />
    </ButtonIcon>
  );
};

export default FollowFeedItemButton;
