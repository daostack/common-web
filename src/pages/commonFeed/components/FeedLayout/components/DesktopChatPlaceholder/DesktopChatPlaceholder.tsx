import React, { FC } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/ui-kit";
import desktopChatStyles from "../DesktopChat/DesktopChat.module.scss";
import styles from "./DesktopChatPlaceholder.module.scss";

interface DesktopChatPlaceholderProps {
  className?: string;
}

const DesktopChatPlaceholder: FC<DesktopChatPlaceholderProps> = (props) => {
  const { className } = props;

  return (
    <div
      className={classNames(
        desktopChatStyles.container,
        styles.container,
        className,
      )}
    >
      <div className={desktopChatStyles.titleWrapper} />
      <div className={styles.loaderWrapper}>
        <Loader />
      </div>
    </div>
  );
};

export default DesktopChatPlaceholder;
