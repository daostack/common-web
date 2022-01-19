import { useCallback, useRef, useState, RefObject } from "react";
import useWindowSize from "./useWindowSize";

interface Return<T extends Element> {
  ref: RefObject<T>;
  isFullTextShowing: boolean;
  shouldShowFullText: boolean;
  showFullText: () => void;
}

const useFullText = <T extends Element = HTMLDivElement>(): Return<T> => {
  useWindowSize();

  const ref = useRef<T>(null);
  const [shouldShowFullText, setShouldShowFullText] = useState(false);
  const isFullTextShowing =
    shouldShowFullText ||
    Boolean(
      ref.current && ref.current.clientHeight >= ref.current.scrollHeight
    );

  const showFullText = useCallback(() => {
    setShouldShowFullText(true);
  }, []);

  return {
    ref,
    isFullTextShowing,
    shouldShowFullText,
    showFullText,
  };
};

export default useFullText;
