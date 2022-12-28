import React, { cloneElement, FC, isValidElement } from "react";
import classNames from "classnames";
import styles from "./ToolbarButton.module.scss";

interface ToolbarButtonProps
  extends Pick<JSX.IntrinsicElements["button"], "onClick"> {
  active?: boolean;
}

const ToolbarButton: FC<ToolbarButtonProps> = (props) => {
  const { active = false, onClick, children } = props;
  const className = classNames(styles.button, {
    [styles.buttonActive]: active,
  });
  let iconEl = children;

  if (isValidElement(children)) {
    iconEl = cloneElement(children, {
      ...children.props,
      className: classNames(styles.icon, children.props.className),
    });
  }

  return (
    <button className={className} onClick={onClick}>
      {iconEl}
    </button>
  );
};

export default ToolbarButton;
