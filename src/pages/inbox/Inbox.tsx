import React, { FC } from "react";
import { CommonSidenavLayoutTabs } from "@/shared/layouts";
import styles from "./Inbox.module.scss";

const InboxPage: FC = () => {
  return <CommonSidenavLayoutTabs className={styles.tabs} />;
};

export default InboxPage;
