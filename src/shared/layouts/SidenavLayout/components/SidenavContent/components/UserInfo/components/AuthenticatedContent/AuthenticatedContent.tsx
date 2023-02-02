import React, { FC } from "react";
import { Menu, Transition } from "@headlessui/react";
import { RightArrowThinIcon } from "@/shared/icons";
import { Content } from "../Content";
import { MenuItems } from "../MenuItems";
import styles from "./AuthenticatedContent.module.scss";

interface AuthenticatedContentProps {
  avatarURL?: string;
  userName?: string;
}

const AuthenticatedContent: FC<AuthenticatedContentProps> = (props) => {
  const { avatarURL, userName } = props;

  return (
    <Menu>
      <Menu.Button as={React.Fragment}>
        <Content
          avatarURL={avatarURL}
          userName={userName}
          leftSideEl={<RightArrowThinIcon className={styles.arrowIcon} />}
        />
      </Menu.Button>
      <Transition
        enter={styles.menuTransitionEnter}
        enterTo={styles.menuTransitionEnterActive}
        leave={styles.menuTransitionExit}
        leaveTo={styles.menuTransitionExitActive}
      >
        <MenuItems />
      </Transition>
    </Menu>
  );
};

export default AuthenticatedContent;
