import React from "react";
import classNames from "classnames";
import "./index.scss";

interface IFrameProps {
  src: string;
  frameBorder: string;
  title: string;
  onLoad?: () => void;
  className?: string;
}

const IFrame = (props: IFrameProps) => (
  <iframe
    {...props}
    className={classNames("payment-iframe", props.className)}
    title={props.title}
  />
);

export default IFrame;
