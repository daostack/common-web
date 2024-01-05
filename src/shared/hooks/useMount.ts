import { useRef, useState } from "react";
import { useUpdateEffect } from "react-use";

interface Options {
  isOpen: boolean;
  delay: number;
}

export const useMount = (options: Options): boolean => {
  const { isOpen, delay } = options;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMounted, setIsMounted] = useState(isOpen);

  useUpdateEffect(() => {
    if (isOpen && !isMounted) {
      setTimeout(() => {
        setIsMounted(true);
      }, 0);
      return;
    }

    if (isOpen || !isMounted) {
      return;
    }

    timeoutRef.current = setTimeout(() => {
      setIsMounted(false);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  return isMounted;
};
