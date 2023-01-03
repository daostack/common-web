import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { useCommonDataContext } from "@/pages/common/providers";
import { CommonService, Logger } from "@/services";
import { Circle } from "@/shared/models";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import styles from "./PopoverItem.module.scss";

interface CommonMemberInfoProps {
  className?: string;
  commonId: string;
  circleId: string;
  isMember: boolean;
  isPending: boolean;
  circleName: string;
  governanceCircleIds: string[];
  canRequestToJoin: boolean;
  canLeaveCircle: boolean;
  shouldShowLeaveButton: boolean;
  circle: Circle;
  userId: string;
}

export const PopoverItem: FC<CommonMemberInfoProps> = (props) => {
  const {
    className,
    commonId,
    circleId,
    isMember,
    isPending,
    circleName,
    governanceCircleIds,
    canRequestToJoin,
    canLeaveCircle,
    shouldShowLeaveButton,
    userId,
    circle,
  } = props;
  const [membersCount, setMembersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
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
                title: "Test",
                description: "Test 21312",
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
  }, [isMember, isPending]);

  useEffect(() => {
    if (!commonId || !circleId) {
      return;
    }

    (async () => {
      try {
        const circleMemberCount =
          await CommonService.getCircleMemberCountByCircleIds({
            commonId,
            circleIds: governanceCircleIds,
          });
        setMembersCount(circleMemberCount);
      } catch (e) {
        Logger.error({ commonId, circleId, e });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [commonId, circleId]);

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
        <span className={styles.membersCount}>
          {isLoading ? (
            <Loader className={styles.membersCountLoader} />
          ) : (
            membersCount
          )}{" "}
          members
        </span>
      </div>
      <ActionButton />
    </div>
  );
};
