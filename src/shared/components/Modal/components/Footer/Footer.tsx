import { useCallback, useEffect, FC } from "react";

import { useModalContext, FooterOptions } from "../../context";
import { useComponentWillUnmount } from "../../../../../shared/hooks/useComponentWillUnmount";

type FooterProps = FooterOptions;

const Footer: FC<FooterProps> = (props) => {
  const { children, alwaysVisible, sticky } = props;
  const { setFooter, setFooterOptions } = useModalContext();

  const reset = useCallback(() => {
    setFooter(null);
    setFooterOptions({});
  }, [setFooter, setFooterOptions]);

  useEffect(() => {
    setFooter(children || null);
  }, [children]);

  useEffect(() => {
    setFooterOptions({
      alwaysVisible,
      sticky,
    });
  }, [alwaysVisible, sticky]);

  useComponentWillUnmount(reset);

  return null;
};

export default Footer;
