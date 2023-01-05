import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers";
import { Circle } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import styles from "./PopoverItem.module.scss";

interface CommonMemberInfoProps {
  className?: string;
  commonId: string;
  circleId: string;
  isMember: boolean;
  isPending: boolean;
  circleName: string;
  canRequestToJoin: boolean;
  canLeaveCircle: boolean;
  shouldShowLeaveButton: boolean;
  circle: Circle;
  userId: string;
  userName: string;
  membersCount: number;
}

export const PopoverItem: FC<CommonMemberInfoProps> = (props) => {
  const {
    className,
    commonId,
    circleId,
    isMember,
    isPending,
    circleName,
    canRequestToJoin,
    canLeaveCircle,
    shouldShowLeaveButton,
    userId,
    circle,
    userName,
    membersCount,
  } = props;
  const { onLeaveCircle, onJoinCircle } = useCommonDataContext();

  const ActionButton = useCallback(() => {
    if (isMember && !shouldShowLeaveButton) {
      return <></>;
    }

    if (isMember && canLeaveCircle && shouldShowLeaveButton) {
      return (
        <Button
          className={styles.actionButton}
          variant={ButtonVariant.OutlineBlue}
          onClick={() => onLeaveCircle(commonId, userId, circle)}
        >
          Leave Circle
        </Button>
      );
    }

    if (isPending) {
      return <p className={styles.pendingStatus}>Pending</p>;
    }

    return (
      <Button
        className={styles.actionButton}
        variant={ButtonVariant.OutlineBlue}
        disabled={!canRequestToJoin}
        onClick={() =>
          onJoinCircle(
            {
              args: {
                commonId,
                title: `Assign circle proposal for ${userName}`,
                description: `Join circle request: ${circleName}`,
                images: [],
                links: [],
                files: [],
                circleId,
                userId,
              },
            },
            circleName,
          )
        }
      >
        Request to join
      </Button>
    );
  }, [isMember, isPending, commonId, circleId, userId, circleName, userName]);

  return (
    <div className={classNames(styles.item, className)}>
      <div className={styles.leftContent}>
        <p
          className={classNames(styles.circleName, {
            [styles.disabled]: !isMember,
          })}
        >
          {circleName}
        </p>
        <span className={styles.membersCount}>{membersCount} members</span>
      </div>
      <ActionButton />
    </div>
  );
};
