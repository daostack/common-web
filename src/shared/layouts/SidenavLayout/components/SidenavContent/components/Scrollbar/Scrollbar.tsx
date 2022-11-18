import React, { FC } from "react";
import {
  Scrollbar as ReactScrollbar,
  ScrollbarProps as ReactScrollbarProps,
} from "react-scrollbars-custom";
import styles from "./Scrollbar.module.scss";

const Scrollbar: FC<ReactScrollbarProps> = (props) => {
  const ConvertedReactScrollbar =
    ReactScrollbar as unknown as FC<ReactScrollbarProps>;

  return (
    <ConvertedReactScrollbar
      {...props}
      style={{
        width: "100%",
        height: "100%",
        ...(props.style || {}),
      }}
      rtl={false}
      noDefaultStyles
      wrapperProps={{ className: styles.wrapper }}
      scrollerProps={{ className: styles.scroller }}
      contentProps={{ className: styles.content }}
      trackYProps={{ className: styles.trackY }}
      thumbYProps={{ className: styles.thumbY }}
      native={false}
    />
  );
};

export default Scrollbar;
