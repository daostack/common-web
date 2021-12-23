import React, { ReactElement } from "react";
import classNames from "classnames";
import "./index.scss";

interface LoaderProps {
  className?: string;
}

export default function Loader(props: LoaderProps): ReactElement {
  return <div className={classNames("loader-wrapper", props.className)} />;
}
