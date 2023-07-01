import React, { FC } from "react";
import classNames from "classnames";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { InboxIcon } from "@/shared/icons";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className } = props;
  const isMobileVersion = useIsTabletView();

  if (isMobileVersion) {
    return null;
  }

  return (
    <div className={classNames(styles.container, className)}>
      <div className={styles.content}>
        <InboxIcon className={styles.inboxIcon} />
        <h1 className={styles.title}>Inbox</h1>
      </div>
    </div>
  );
};

export default HeaderContent;
