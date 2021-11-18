import { useEffect, useRef } from "react";

export const useComponentWillUnmount = (cleanupFunc: () => void): void => {
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    return () => {
      isUnmountingRef.current = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (isUnmountingRef.current) {
        cleanupFunc();
      }
    };
  }, [cleanupFunc]);
};
