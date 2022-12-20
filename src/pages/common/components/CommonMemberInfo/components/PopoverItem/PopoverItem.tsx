import React, { FC, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { fetchCircleMemberCountByCircleId } from "@/pages/OldCommon/store/api";
import { Button, ButtonVariant } from "@/shared/ui-kit";
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
      const circleMemberCount = await fetchCircleMemberCountByCircleId({
        commonId,
        circleId,
      });
      setMembersCount(circleMemberCount);
    })();
  }, [commonId]);

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
        <p className={styles.membersCount}>{membersCount} members</p>
      </div>
      <ActionButton />
    </div>
  );
};
