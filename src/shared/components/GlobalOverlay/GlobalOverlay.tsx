import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface GlobalOverlayProps {
  className?: string;
}

const GlobalOverlay: FC<GlobalOverlayProps> = ({ className }) => {
  return <div className={classNames("global-overlay", className)} />;
};

export default GlobalOverlay;
