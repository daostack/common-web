import React, { FC } from "react";
import classNames from "classnames";
import styles from "./Loader.module.scss";

interface LoaderProps {
  className?: string;
}

const Loader: FC<LoaderProps> = (props) => {
  const { className } = props;

  return <div className={classNames(styles.loader, className)} />;
};

export default Loader;
