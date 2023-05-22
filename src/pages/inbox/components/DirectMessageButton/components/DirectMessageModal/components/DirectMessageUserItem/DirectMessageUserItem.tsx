import React, { FC } from "react";
import classNames from "classnames";
import { UserAvatar } from "@/shared/components";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./DirectMessageUserItem.module.scss";

interface DirectMessageUserItemProps {
  className?: string;
  image: string;
  name: string;
  lastActivity?: number;
  notificationsAmount?: number;
  isActive?: boolean;
}

const DirectMessageUserItem: FC<DirectMessageUserItemProps> = (props) => {
  const {
    className,
    image,
    name,
    lastActivity,
    notificationsAmount,
    isActive = false,
  } = props;
  const hasRightContent = Boolean(lastActivity || notificationsAmount);

  return (
    <div
      className={classNames(styles.container, className, {
        [styles.containerActive]: isActive,
      })}
    >
      <div className={styles.left}>
        <UserAvatar
          className={styles.image}
          photoURL={image}
          nameForRandomAvatar={name}
          userName={name}
        />
        <span className={styles.name}>{name}</span>
      </div>
      {hasRightContent && (
        <div className={styles.right}>
          {lastActivity && (
            <span className={styles.lastActivity}>
              Last activity: {<TimeAgo milliseconds={lastActivity} />}
            </span>
          )}
          {Boolean(notificationsAmount) && (
            <span className={styles.notificationsAmount}>
              {notificationsAmount}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectMessageUserItem;
