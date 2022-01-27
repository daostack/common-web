import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface StickyInfoProps {
  className?: string;
}

const StickyInfo: FC<StickyInfoProps> = ({ className, children }) => {
  return (
    <div className={classNames("trustee-sticky-info", className)}>
      {children}
    </div>
  );
};

export default StickyInfo;
