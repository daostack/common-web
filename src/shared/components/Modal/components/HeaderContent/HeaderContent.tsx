import { useCallback, useEffect, FC } from "react";

import { useModalContext } from "../../context";
import { useComponentWillUnmount } from "../../../../../shared/hooks/useComponentWillUnmount";

const HeaderContent: FC = (props) => {
  const { children } = props;
  const { setHeaderContent } = useModalContext();

  const reset = useCallback(() => {
    setHeaderContent(null);
  }, [setHeaderContent]);

  useEffect(() => {
    setHeaderContent(children || null);
  }, [setHeaderContent, children]);

  useComponentWillUnmount(reset);

  return null;
};

export default HeaderContent;
