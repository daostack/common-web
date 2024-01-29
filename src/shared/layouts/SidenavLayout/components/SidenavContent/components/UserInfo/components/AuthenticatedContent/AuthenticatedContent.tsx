import React, { FC } from "react";
import classNames from "classnames";
import { Menu, Transition } from "@headlessui/react";
import { RightArrowThinIcon } from "@/shared/icons";
import { Content, ContentStyles } from "../Content";
import { MenuItems, MenuItemsPlacement, MenuItemsStyles } from "../MenuItems";
import styles from "./AuthenticatedContent.module.scss";

interface AuthenticatedContentProps {
  avatarURL?: string;
  userName?: string;
  menuItemsPlacement?: MenuItemsPlacement;
  rightArrowIconClassName?: string;
  contentStyles?: ContentStyles;
  menuItemsStyles?: MenuItemsStyles;
}

const AuthenticatedContent: FC<AuthenticatedContentProps> = (props) => {
  const {
    avatarURL,
    userName,
    menuItemsPlacement,
    rightArrowIconClassName,
    contentStyles,
    menuItemsStyles,
  } = props;

  return (
    <Menu>
      {({ open }) => (
        <>
          <Menu.Button as={React.Fragment}>
            <Content
              open={open}
              avatarURL={avatarURL}
              userName={userName}
              leftSideEl={
                <RightArrowThinIcon
                  className={classNames(
                    styles.arrowIcon,
                    rightArrowIconClassName,
                  )}
                />
              }
              styles={contentStyles}
            />
          </Menu.Button>
          <Transition
            enter={styles.menuTransitionEnter}
            enterTo={styles.menuTransitionEnterActive}
            leave={styles.menuTransitionExit}
            leaveTo={styles.menuTransitionExitActive}
          >
            <MenuItems
              placement={menuItemsPlacement}
              styles={menuItemsStyles}
            />
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default AuthenticatedContent;
