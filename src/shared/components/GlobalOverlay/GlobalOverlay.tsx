import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface GlobalOverlayProps {
  className?: string;
}

const GlobalOverlay: FC<GlobalOverlayProps> = ({ className, children }) => {
  return (
    <div className={classNames("global-overlay", className)}>{children}</div>
  );
};

export default GlobalOverlay;
