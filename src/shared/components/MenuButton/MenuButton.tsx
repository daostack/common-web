import React, { ForwardRefRenderFunction, forwardRef } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Orientation } from "@/shared/constants";
import MenuIcon from "@/shared/icons/menu.icon";
import "./index.scss";

interface MenuButtonProps {
  onClick?: () => void;
  className?: string;
  withBorder?: boolean;
  variant?: Orientation;
}

const MenuButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  MenuButtonProps
> = (
  { onClick, className, withBorder, variant = Orientation.Vertical },
  ref,
) => (
  <ButtonIcon
    ref={ref}
    className={classNames("menu-button", className, {
      "menu-button--with-border": withBorder,
    })}
    onClick={onClick}
  >
    <MenuIcon className="menu-button__icon" variant={variant} />
  </ButtonIcon>
);

export default forwardRef(MenuButton);
