import React, { FC } from "react";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MoreIcon } from "@/shared/icons";
import { DesktopMenu, MobileMenu } from "@/shared/ui-kit";
import { useMenuItems } from "./hooks";
import styles from "./SettingsMenuButton.module.scss";

interface Styles {
  container?: string;
  button?: string;
  menuItems?: string;
}

interface SettingsMenuButtonProps {
  isMobileVersion?: boolean;
  styles?: Styles;
  onAccountDelete: () => void;
}

const SettingsMenuButton: FC<SettingsMenuButtonProps> = (props) => {
  const {
    isMobileVersion = false,
    styles: outerStyles,
    onAccountDelete,
  } = props;
  const items = useMenuItems({ onAccountDelete });

  if (items.length === 0) {
    return null;
  }

  const buttonEl = (
    <ButtonIcon className={outerStyles?.button}>
      <MoreIcon className={styles.icon} />
    </ButtonIcon>
  );

  if (!isMobileVersion) {
    return (
      <DesktopMenu
        className={outerStyles?.container}
        menuItemsClassName={outerStyles?.menuItems}
        triggerEl={buttonEl}
        items={items}
      />
    );
  }

  return (
    <MobileMenu
      className={outerStyles?.container}
      triggerEl={buttonEl}
      items={items}
    />
  );
};

export default SettingsMenuButton;
