import React, { FC } from "react";
import classNames from "classnames";
import { InboxIcon, RightArrowThinIcon } from "@/shared/icons";
import { TopNavigationOpenSidenavButton } from "@/shared/ui-kit";
import { getPluralEnding } from "@/shared/utils";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <TopNavigationOpenSidenavButton
          className={styles.openSidenavButton}
          iconEl={<RightArrowThinIcon className={styles.openSidenavIcon} />}
        />
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
    </div>
  );
};

export default HeaderContent;
