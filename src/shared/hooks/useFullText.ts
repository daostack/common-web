import { useCallback, useEffect, useRef, useState, RefObject } from "react";

interface Return<T extends Element> {
  ref: RefObject<T>;
  isFullTextShowing: boolean;
  shouldShowFullText: boolean;
  showFullText: () => void;
}

const checkFullTextShowing = <T extends Element>(ref: RefObject<T>): boolean =>
  Boolean(ref.current && ref.current.clientHeight >= ref.current.scrollHeight);

const useFullText = <T extends Element = HTMLDivElement>(): Return<T> => {
  const ref = useRef<T>(null);
  const [shouldShowFullText, setShouldShowFullText] = useState(false);
  const isFullTextShowing = shouldShowFullText || checkFullTextShowing(ref);
  const [, setIsFullTextShowingAfterResize] = useState(isFullTextShowing);

  const showFullText = useCallback(() => {
    setShouldShowFullText(true);
  }, []);

  useEffect(() => {
    if (shouldShowFullText) {
      return;
    }

    const handleResize = () => {
      setIsFullTextShowingAfterResize(checkFullTextShowing(ref));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [shouldShowFullText]);

  return {
    ref,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  };
};

export default useFullText;
