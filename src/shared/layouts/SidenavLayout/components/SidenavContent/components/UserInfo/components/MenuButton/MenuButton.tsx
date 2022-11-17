import React, { FC } from "react";
import { Menu } from "@headlessui/react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Image } from "@/shared/components/Image";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon, SmallArrowIcon } from "@/shared/icons";
import styles from "./MenuButton.module.scss";

interface MenuButtonProps {
  avatarURL?: string;
  userName?: string;
}

const MenuButton: FC<MenuButtonProps> = (props) => {
  const { avatarURL = avatarPlaceholderSrc, userName } = props;
  const isTabletView = useIsTabletView();
  const ArrowIcon = isTabletView ? RightArrowThinIcon : SmallArrowIcon;

  return (
    <Menu.Button as={React.Fragment}>
      <button className={styles.menuButton}>
        <Image
          className={styles.avatar}
          src={avatarURL}
          alt={userName ? `${userName}'s avatar` : "User's avatar"}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <span className={styles.name}>{userName}</span>
        <ArrowIcon className={styles.arrowIcon} />
      </button>
    </Menu.Button>
  );
};

export default MenuButton;
