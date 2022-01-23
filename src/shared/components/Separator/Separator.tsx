import React, { FC } from "react";
import classNames from "classnames";
import "./index.scss";

interface SeparatorProps {
  className?: string;
}

const Separator: FC<SeparatorProps> = ({ className }) => {
  return <div className={classNames("general-separator", className)} />;
};

export default Separator;
