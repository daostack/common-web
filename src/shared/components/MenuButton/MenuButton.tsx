import React, { ForwardRefRenderFunction, forwardRef } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { Orientation } from "@/shared/constants";
import { RightArrowThinIcon } from "@/shared/icons";
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
) => {
  const Icon = React.useCallback(() => {
    switch (variant) {
      case Orientation.Arrow: {
        return (
          <RightArrowThinIcon
            className={classNames("menu-button__icon", "arrow__icon")}
          />
        );
      }
      default: {
        return <MenuIcon className="menu-button__icon" variant={variant} />;
      }
    }
  }, [variant]);

  return (
    <ButtonIcon
      ref={ref}
      className={classNames("menu-button", className, {
        "menu-button--with-border": withBorder,
        "menu-button--arrow": variant === Orientation.Arrow
      })}
      onClick={onClick}
    >
      <Icon />
    </ButtonIcon>
  );
};

export default forwardRef(MenuButton);
