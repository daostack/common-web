import React, { FC } from "react";
import classNames from "classnames";
import styles from "./HeaderContent.module.scss";

interface HeaderContentProps {
  className?: string;
  commonName: string;
  commonImage: string;
  isProject?: boolean;
}

const HeaderContent: FC<HeaderContentProps> = (props) => {
  const { className, commonName, commonImage, isProject = false } = props;

  return (
    <div className={classNames(styles.container, className)}>{commonName}</div>
  );
};

export default HeaderContent;
