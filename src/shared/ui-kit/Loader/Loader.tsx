import React, { FC } from "react";
import classNames from "classnames";
import loaderDefault from "@/shared/assets/icons/loader-pink.svg";
import loaderWhite from "@/shared/assets/icons/loader-white.svg";
import { Portal } from "../Portal";
import styles from "./Loader.module.scss";

export enum LoaderVariant {
  Default,
  Global,
}

export enum LoaderColor {
  Default,
  White,
}

interface LoaderProps {
  className?: string;
  overlayClassName?: string;
  variant?: LoaderVariant;
  color?: LoaderColor;
}

const Loader: FC<LoaderProps> = (props) => {
  const {
    className,
    overlayClassName,
    variant = LoaderVariant.Default,
    color = LoaderColor.Default,
  } = props;
  const loaderEl = (
    <img
      className={classNames(styles.loader, className)}
      src={color === LoaderColor.White ? loaderWhite : loaderDefault}
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
