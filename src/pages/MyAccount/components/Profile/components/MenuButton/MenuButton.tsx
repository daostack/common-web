import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  className?: string;
  text: string;
  to?: string;
  onClick?: () => void;
  iconEl?: ReactNode;
}

const MenuButton: FC<MenuButtonProps> = (props) => {
  const { text, to, onClick, iconEl } = props;
  const className = classNames(styles.container, props.className);
  const contentEl = (
    <>
      <span className={styles.text}>{text}</span>
      {iconEl || <RightArrowThinIcon />}
    </>
  );

  if (!to) {
    return (
      <ButtonLink className={className} onClick={onClick}>
        {contentEl}
      </ButtonLink>
    );
  }

  return (
    <NavLink className={className} to={to}>
      {contentEl}
    </NavLink>
  );
};

export default MenuButton;
