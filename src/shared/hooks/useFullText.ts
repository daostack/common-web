import {
  useCallback,
  useEffect,
  useRef,
  useState,
  RefObject,
  useLayoutEffect,
} from "react";

interface Return<T extends Element> {
  ref: RefObject<T>;
  isFullTextShowing: boolean;
  shouldShowFullText: boolean;
  showFullText: () => void;
  toggleFullText: () => void;
}

const checkFullTextShowing = <T extends Element>(ref: RefObject<T>): boolean =>
  Boolean(ref.current && ref.current.clientHeight >= ref.current.scrollHeight);

const useFullText = <T extends Element = HTMLDivElement>(): Return<T> => {
  const ref = useRef<T>(null);
  const [shouldShowFullText, setShouldShowFullText] = useState(false);
  const isFullTextShowing = checkFullTextShowing(ref);
  const [, setIsFullTextShowingAfterResize] = useState(isFullTextShowing);

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
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
    toggleFullText,
  };
};

export default useFullText;
