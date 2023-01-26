import React, { FC, useCallback } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers";
import { Circle } from "@/shared/models";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
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
  isHighestTierCircle: boolean;
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
    isHighestTierCircle,
  } = props;
  const { onLeaveCircle, onJoinCircle } = useCommonDataContext();

  const handleLeaveCircle = useCallback(() => {
    onLeaveCircle(commonId, userId, circle);
  }, [commonId, userId, circle]);

  const ActionButton = useCallback(() => {
    if (isMember && !shouldShowLeaveButton) {
      return <></>;
    }

    if (isMember && canLeaveCircle && shouldShowLeaveButton) {
      const disabledLeaveButton = isHighestTierCircle && membersCount === 1;

      const buttonEl = (
        <Button
          className={styles.actionButton}
          variant={ButtonVariant.OutlineBlue}
          onClick={handleLeaveCircle}
          visuallyDisabled={disabledLeaveButton}
        >
          Leave Circle
        </Button>
      );

      if (disabledLeaveButton) {
        return (
          <Tooltip placement="bottom-end">
            <TooltipTrigger asChild>{buttonEl}</TooltipTrigger>
            <TooltipContent className={styles.tooltipContent}>
              Looks like you are the only member in the leadership circle, and
              thus you can't leave it until someone else joins the circle.
            </TooltipContent>
          </Tooltip>
        );
      }

      return buttonEl;
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
                title: `Request to join ${circleName} circle by ${userName}`,
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
  }, [
    isMember,
    isPending,
    commonId,
    circleId,
    userId,
    circleName,
    userName,
    isHighestTierCircle,
    membersCount,
  ]);

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
