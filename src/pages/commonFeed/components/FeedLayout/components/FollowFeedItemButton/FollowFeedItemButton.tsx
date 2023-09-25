import React, { FC } from "react";
import classNames from "classnames";
import { useFeedItemFollow } from "@/shared/hooks/useCases";
import { StarIcon } from "@/shared/icons";
import { ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import styles from "./FollowFeedItemButton.module.scss";

interface FollowFeedItemButtonProps {
  feedItemId: string;
  commonId: string;
}

const FollowFeedItemButton: FC<FollowFeedItemButtonProps> = (props) => {
  const { feedItemId, commonId } = props;
  const { isDisabled, isFollowing, onFollowToggle } = useFeedItemFollow({
    feedItemId,
    commonId,
  });

  return (
    <ButtonIcon
      className={styles.button}
      variant={ButtonVariant.OutlinePink}
      onClick={() => onFollowToggle()}
      disabled={isDisabled}
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
