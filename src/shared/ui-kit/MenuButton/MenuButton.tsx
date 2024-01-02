import React, { forwardRef, ForwardRefRenderFunction } from "react";
import { Orientation } from "@/shared/constants";
import { MenuIcon } from "@/shared/icons";
import { ButtonVariant } from "../Button";
import { ButtonIcon } from "../ButtonIcon";
import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  onClick?: () => void;
  variant?: ButtonVariant;
}

const MenuButton: ForwardRefRenderFunction<
  HTMLButtonElement,
  MenuButtonProps
> = (props, ref) => {
  const { onClick } = props;

  return (
    <ButtonIcon ref={ref} onClick={onClick} className={styles.buttonIcon}>
      <MenuIcon className={styles.icon} variant={Orientation.Vertical} />
    </ButtonIcon>
  );
};

export default forwardRef(MenuButton);
