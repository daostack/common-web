import React, { FC } from "react";
import { Image } from "@/shared/components";
import { TimeAgo } from "@/shared/ui-kit";
import styles from "./DirectMessageUserItem.module.scss";

interface DirectMessageUserItemProps {
  image: string;
  name: string;
  lastActivity?: number;
  notificationsAmount?: number;
}

const DirectMessageUserItem: FC<DirectMessageUserItemProps> = (props) => {
  const { image, name, lastActivity, notificationsAmount } = props;
  const hasRightContent = Boolean(lastActivity || notificationsAmount);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Image
          className={styles.image}
          src={image}
          alt={`${name}'s image`}
          placeholderElement={null}
          aria-hidden
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
