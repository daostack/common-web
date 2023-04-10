import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { selectUser } from "@/pages/Auth/store/selectors";
import { FollowFeedItemAction } from "@/shared/constants";
import {
  useFollowFeedItem,
  useUserFeedItemFollowData,
} from "@/shared/hooks/useCases";
import { StarIcon } from "@/shared/icons";
import { ButtonIcon, ButtonVariant } from "@/shared/ui-kit";
import styles from "./FollowFeedItemButton.module.scss";

interface FollowFeedItemButtonProps {
  feedItemId: string;
  commonId: string;
}

const FollowFeedItemButton: FC<FollowFeedItemButtonProps> = (props) => {
  const { feedItemId, commonId } = props;
  const [isFollowing, setIsFollowing] = useState(false);
  const {
    fetched: isUserFeedItemFollowDataFetched,
    data: userFeedItemFollowData,
    fetchUserFeedItemFollowData,
    setUserFeedItemFollowData,
  } = useUserFeedItemFollowData();
  const {
    isFollowingInProgress,
    isFollowingFinishedWithError,
    followFeedItem,
    cancelFeedItemFollowing,
  } = useFollowFeedItem();
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isDisabled = !isUserFeedItemFollowDataFetched || isFollowingInProgress;

  const handleFeedItemFollowClick = () => {
    followFeedItem({
      feedItemId,
      commonId,
      action: isFollowing
        ? FollowFeedItemAction.Unfollow
        : FollowFeedItemAction.Follow,
    });
    setIsFollowing((value) => !value);
  };

  useEffect(() => {
    setIsFollowing(false);

    if (userId) {
      fetchUserFeedItemFollowData(userId, feedItemId);
    } else {
      setUserFeedItemFollowData(null);
    }

    return () => {
      cancelFeedItemFollowing();
    };
  }, [userId, feedItemId]);

  useEffect(() => {
    if (isUserFeedItemFollowDataFetched) {
      setIsFollowing(Boolean(userFeedItemFollowData));
    }
  }, [isUserFeedItemFollowDataFetched]);

  useEffect(() => {
    if (isFollowingFinishedWithError) {
      setIsFollowing((value) => !value);
    }
  }, [isFollowingFinishedWithError]);

  return (
    <ButtonIcon
      className={styles.button}
      variant={ButtonVariant.OutlinePink}
      onClick={handleFeedItemFollowClick}
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
