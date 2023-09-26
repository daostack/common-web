import React, { FC } from "react";
import { Orientation } from "@/shared/constants";
import { MenuIcon } from "@/shared/icons";
import { ButtonVariant } from "../Button";
import { ButtonIcon } from "../ButtonIcon";
import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  onClick?: () => void;
  variant?: ButtonVariant;
}

const MenuButton: FC<MenuButtonProps> = ({
  onClick,
  variant = ButtonVariant.PrimaryGray,
}) => {
  return (
    <ButtonIcon variant={variant} onClick={onClick}>
      <MenuIcon className={styles.icon} variant={Orientation.Vertical} />
    </ButtonIcon>
  );
};

export default MenuButton;
