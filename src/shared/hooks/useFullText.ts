import {
  useCallback,
  useEffect,
  useRef,
  useState,
  RefCallback,
  RefObject,
  useLayoutEffect,
} from "react";
import { useForceUpdate } from "@/shared/hooks";

interface Return<T extends Element> {
  ref: RefObject<T>;
  setRef: RefCallback<T>;
  isFullTextShowing: boolean;
  shouldShowFullText: boolean;
  showFullText: () => void;
  toggleFullText: () => void;
}

const SCROLL_HEIGHT_DIFF = 2;

const checkFullTextShowing = <T extends Element>(ref: RefObject<T>): boolean =>
  Boolean(
    ref.current &&
      ref.current.clientHeight >= ref.current.scrollHeight - SCROLL_HEIGHT_DIFF,
  );

const useFullText = <T extends Element = HTMLDivElement>(): Return<T> => {
  const ref = useRef<T | null>(null);
  const forceUpdate = useForceUpdate();
  const [shouldShowFullText, setShouldShowFullText] = useState(false);
  const isFullTextShowing = checkFullTextShowing(ref);
  const [, setIsFullTextShowingAfterResize] = useState(isFullTextShowing);

  const setRef = useCallback<RefCallback<T>>(
    (element) => {
      ref.current = element;
      forceUpdate();
    },
    [ref],
  );

  const showFullText = useCallback(() => {
    setShouldShowFullText(true);
  }, []);

  const toggleFullText = useCallback(() => {
    setShouldShowFullText((value) => !value);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsFullTextShowingAfterResize(checkFullTextShowing(ref));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useLayoutEffect(() => {
    setIsFullTextShowingAfterResize(checkFullTextShowing(ref));
  });

  return {
    ref,
    setRef,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
    toggleFullText,
  };
};

export default useFullText;
