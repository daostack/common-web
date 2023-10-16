import React, { FC } from "react";
import classNames from "classnames";
import styles from "./HeaderContentWrapper.module.scss";

interface HeaderContentWrapperProps {
  className?: string;
}

const HeaderContentWrapper: FC<HeaderContentWrapperProps> = (props) => {
  const { className, children } = props;

  return (
    <div className={classNames(styles.container, className)}>{children}</div>
  );
};

export default HeaderContentWrapper;
