import React, { FC } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/ui-kit";
import { DesktopRightPane } from "../DesktopRightPane";
import desktopChatStyles from "../DesktopChat/DesktopChat.module.scss";
import styles from "./DesktopChatPlaceholder.module.scss";

interface DesktopChatPlaceholderProps {
  className?: string;
  isItemSelected: boolean;
  withTitle?: boolean;
}

const DesktopChatPlaceholder: FC<DesktopChatPlaceholderProps> = (props) => {
  const { className, isItemSelected, withTitle = true } = props;

  return (
    <DesktopRightPane className={classNames(styles.container, className)}>
      {withTitle && <div className={desktopChatStyles.titleWrapper} />}
      <div className={styles.loaderWrapper}>{isItemSelected && <Loader />}</div>
    </DesktopRightPane>
  );
};

export default DesktopChatPlaceholder;
