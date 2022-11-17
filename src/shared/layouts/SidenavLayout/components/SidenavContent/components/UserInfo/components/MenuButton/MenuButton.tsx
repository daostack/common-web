import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon, SmallArrowIcon } from "@/shared/icons";
import { Content } from "../Content";
import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  avatarURL?: string;
  userName?: string;
}

const MenuButton: FC<MenuButtonProps> = (props) => {
  const { avatarURL, userName } = props;
  const isTabletView = useIsTabletView();
  const ArrowIcon = isTabletView ? RightArrowThinIcon : SmallArrowIcon;

  return (
    <Menu.Button as={React.Fragment}>
      <Content
        avatarURL={avatarURL}
        userName={userName}
        leftSideEl={<ArrowIcon className={styles.arrowIcon} />}
      />
    </Menu.Button>
  );
};

export default MenuButton;
