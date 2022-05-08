import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components";
import { Orientation } from "@/shared/constants";
import MenuIcon from "@/shared/icons/menu.icon";
import classNames from "classnames";
import "./index.scss";

interface MenuButtonProps {
  onClick?: () => void;
  className?: string;
  withBorder?: boolean;
  variant?: Orientation;
}

const MenuButton: FC<MenuButtonProps> = (
  {
    onClick,
    className,
    withBorder,
    variant = Orientation.vertical,
  }
) => (
  <ButtonIcon
    className={classNames(
      "menu-button",
      className,
      {
      "menu-button--with-border": withBorder,
      }
    )}
    onClick={onClick}
  >
    <MenuIcon
      className="menu-button__icon"
      variant={variant}
    />
  </ButtonIcon>
);

export default MenuButton;
