import React, { FC } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import { DirectMessageButton } from "../DirectMessageButton";
import { HeaderContent_v04 } from "../HeaderContent_v04";
import { InboxFilterButton } from "../InboxFilterButton";
import { PlusButton } from "./components";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  streamsWithNotificationsAmount: number;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, streamsWithNotificationsAmount } = props;
  const isMobileVersion = useIsTabletView();

  if (isMobileVersion) {
    return (
      <HeaderContent_v04
        className={className}
        streamsWithNotificationsAmount={streamsWithNotificationsAmount}
      />
    );
  }

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <InboxIcon className={styles.inboxIcon} />
        <h1 className={styles.title}>Inbox</h1>
      </div>
      <div className={styles.actionButtonsWrapper}>
        <InboxFilterButton />
        <DirectMessageButton
          isMobileVersion={isMobileVersion}
          ButtonComponent={PlusButton}
        />
      </div>
    </div>
  );
};

export default HeaderContent;
