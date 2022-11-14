import React, { FC } from "react";
import { Menu, Transition } from "@headlessui/react";
import { MenuButton, MenuItems } from "./components";
import styles from "./UserInfo.module.scss";

interface UserInfoProps {
  avatarURL?: string;
  userName?: string;
}

const UserInfo: FC<UserInfoProps> = (props) => {
  const { avatarURL, userName } = props;

  return (
    <div className={styles.container}>
      <Menu>
        <MenuButton avatarURL={avatarURL} userName={userName} />
        <Transition
          enter={styles.menuTransitionEnter}
          enterTo={styles.menuTransitionEnterActive}
          leave={styles.menuTransitionExit}
          leaveTo={styles.menuTransitionExitActive}
        >
          <MenuItems />
        </Transition>
      </Menu>
    </div>
  );
};

export default UserInfo;
