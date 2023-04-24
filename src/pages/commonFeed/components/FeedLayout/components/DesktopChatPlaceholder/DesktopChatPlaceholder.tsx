import React, { FC } from "react";
import classNames from "classnames";
import { Loader } from "@/shared/ui-kit";
import desktopChatStyles from "../DesktopChat/DesktopChat.module.scss";
import styles from "./DesktopChatPlaceholder.module.scss";

interface DesktopChatPlaceholderProps {
  className?: string;
  isItemSelected: boolean;
}

const DesktopChatPlaceholder: FC<DesktopChatPlaceholderProps> = (props) => {
  const { className, isItemSelected } = props;

  return (
    <div
      className={classNames(
        desktopChatStyles.container,
        styles.container,
        className,
      )}
    >
      <div className={desktopChatStyles.titleWrapper} />
      <div className={styles.loaderWrapper}>{isItemSelected && <Loader />}</div>
    </div>
  );
};

export default DesktopChatPlaceholder;
