import React, { FC } from "react";
import classNames from "classnames";
import styles from "./DesktopRightPane.module.scss";

interface DesktopRightPaneProps {
  className?: string;
}

const DesktopRightPane: FC<DesktopRightPaneProps> = (props) => {
  const { className, children } = props;

  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};

export default DesktopRightPane;
