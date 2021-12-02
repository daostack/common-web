import React, { ReactElement } from "react";
import classNames from "classnames";

import "./index.scss";

interface SeparatorProps {
  className?: string;
}

export default function Separator({ className }: SeparatorProps): ReactElement {
  return <div className={classNames("create-common-separator", className)} />;
}
