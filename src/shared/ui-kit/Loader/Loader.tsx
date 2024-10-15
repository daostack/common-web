import React, { FC, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import loaderDefault from "@/shared/assets/icons/loader-pink.svg";
import loaderWhite from "@/shared/assets/icons/loader-white.svg";
import { Portal } from "../Portal";
import styles from "./Loader.module.scss";

export enum LoaderVariant {
  Default,
  Global,
  Big,
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
  delay?: number;
}

const Loader: FC<LoaderProps> = (props) => {
  const {
    className,
    overlayClassName,
    variant = LoaderVariant.Default,
    color = LoaderColor.Default,
    delay,
  } = props;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isShowing, setIsShowing] = useState(!delay);
  const loaderEl = (
    <img
      className={classNames(styles.loader, {
        [styles.bigLoader]: variant === LoaderVariant.Big
      }, className)}
      src={color === LoaderColor.White ? loaderWhite : loaderDefault}
      alt="Loader"
    />
  );

  useEffect(() => {
    if (!delay) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsShowing(true);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

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

  return isShowing ? loaderEl : null;
};

export default Loader;
