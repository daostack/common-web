import React, { FC } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import { getPluralEnding } from "@/shared/utils";
import { DirectMessageButton } from "../DirectMessageButton";
import { PlusButton } from "../HeaderContent/components";
import { InboxFilterButton } from "../InboxFilterButton";
import styles from "./HeaderContent_v04.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
}

const HeaderContent_v04: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount } = props;
  const isMobileVersion = useIsTabletView();

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <div className={styles.infoContainer}>
          <InboxIcon className={styles.inboxIcon} />
          <div className={styles.infoWrapper}>
            <h1 className={styles.title}>Inbox</h1>
            <p className={styles.streamsWithNotificationsAmount}>
              {streamsWithNotificationsAmount} updated stream
              {getPluralEnding(streamsWithNotificationsAmount)}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.actionButtonsWrapper}>
        <InboxFilterButton />
        <DirectMessageButton
          className={styles.directMessageButton}
          isMobileVersion={isMobileVersion}
          ButtonComponent={PlusButton}
        />
      </div>
    </div>
  );
};

export default HeaderContent_v04;
