import React, { FC, useEffect, useRef, useState } from "react";
import { useIntersectionObserver } from "@/shared/hooks";
import { Loader } from "@/shared/ui-kit/Loader";
import styles from "./InfiniteScroll.module.scss";

interface InfiniteScrollProps {
  isLoading: boolean;
  loaderDelay?: number;
  markerClassName?: string;
  onFetchNext: () => void;
}

const InfiniteScroll: FC<InfiniteScrollProps> = (props) => {
  const { isLoading, loaderDelay, markerClassName, onFetchNext, children } =
    props;
  const [isInnerLoading, setIsInnerLoading] = useState(isLoading);
  const markerRef = useRef<HTMLDivElement>(null);
  const isMarkerOnScreen = useIntersectionObserver(markerRef.current);

  useEffect(() => {
    if (isLoading) {
      setIsInnerLoading(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsInnerLoading(false);
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading]);

  useEffect(() => {
    if (isMarkerOnScreen && !isInnerLoading) {
      onFetchNext();
    }
  }, [isMarkerOnScreen, isInnerLoading]);

  return (
    <>
      {children}
      <div className={markerClassName} ref={markerRef} />
      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Loader delay={loaderDelay} />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
