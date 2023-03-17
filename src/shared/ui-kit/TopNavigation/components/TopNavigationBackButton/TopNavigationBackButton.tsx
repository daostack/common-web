import React, { cloneElement, FC, isValidElement, ReactNode } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { Hamburger2Icon } from "@/shared/icons";
import styles from "./TopNavigationBackButton.module.scss";

interface TopNavigationBackButtonProps {
  className?: string;
  iconEl?: ReactNode;
  onClick: () => void;
}

const TopNavigationBackButton: FC<TopNavigationBackButtonProps> = (props) => {
  const { className, onClick } = props;
  let iconEl = <Hamburger2Icon className={styles.icon} />;

  if (isValidElement(props.iconEl)) {
    iconEl = cloneElement(props.iconEl, {
      ...props.iconEl.props,
      className: classNames(styles.icon, props.iconEl.props.className),
    });
  }

  return (
    <ButtonIcon
      className={classNames(styles.button, className)}
      onClick={onClick}
    >
      {iconEl}
    </ButtonIcon>
  );
};

export default TopNavigationBackButton;
