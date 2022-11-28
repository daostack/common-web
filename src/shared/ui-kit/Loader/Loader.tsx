import React, { FC } from "react";
import classNames from "classnames";
import { Portal } from "../Portal";
import styles from "./Loader.module.scss";

export enum LoaderVariant {
  Default,
  Global,
}

interface LoaderProps {
  className?: string;
  variant?: LoaderVariant;
}

const Loader: FC<LoaderProps> = (props) => {
  const { className, variant = LoaderVariant.Default } = props;
  const loaderEl = <div className={classNames(styles.loader, className)} />;

  if (variant === LoaderVariant.Global) {
    return (
      <Portal>
        <div className={styles.globalLoaderOverlay}>
          <div className={styles.globalLoaderWrapper}>{loaderEl}</div>
        </div>
      </Portal>
    );
  }

  return loaderEl;
};

export default Loader;
