import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { CommonService, Logger } from "@/services";
import { Button, ButtonVariant, Loader } from "@/shared/ui-kit";
import styles from "./PopoverItem.module.scss";

interface CommonMemberInfoProps {
  className?: string;
  commonId: string;
  circleId: string;
  isMember: boolean;
  isPending: boolean;
  circleName: string;
}

export const PopoverItem: FC<CommonMemberInfoProps> = (props) => {
  const { className, commonId, circleId, isMember, isPending, circleName } =
    props;
  const [membersCount, setMembersCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const ActionButton = useCallback(() => {
    if (isMember) {
      return (
        <Button
          className={styles.actionButton}
          variant={ButtonVariant.OutlineBlue}
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
      >
        Join circle
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
          await CommonService.getCircleMemberCountByCircleId({
            commonId,
            circleId,
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
