import React, { FC } from "react";
import classNames from "classnames";
import loaderSrc from "@/shared/assets/icons/loader.svg";
import { Portal } from "../Portal";
import styles from "./Loader.module.scss";

export enum LoaderVariant {
  Default,
  Global,
}

interface LoaderProps {
  className?: string;
  overlayClassName?: string;
  variant?: LoaderVariant;
}

const Loader: FC<LoaderProps> = (props) => {
  const {
    className,
    overlayClassName,
    variant = LoaderVariant.Default,
  } = props;
  const loaderEl = (
    <img
      className={classNames(styles.loader, className)}
      src={loaderSrc}
      alt="Loader"
    />
  );

  if (variant === LoaderVariant.Global) {
    return (
      <Portal>
        <div
          className={classNames(styles.globalLoaderOverlay, overlayClassName)}
        >
          <div className={styles.globalLoaderWrapper}>{loaderEl}</div>
        </div>
      </Portal>
    );
  }

  return loaderEl;
};

export default Loader;
