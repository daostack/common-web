import React, { FC, ReactNode } from "react";
import classNames from "classnames";
import { ButtonIcon, UserAvatar } from "@/shared/components";
import { RightArrowThinIcon } from "@/shared/icons";
import styles from "./Header.module.scss";

interface HeaderProps {
  className?: string;
  titleWrapperClassName?: string;
  title: string;
  titleActionElement?: React.ReactElement | null;
  userAvatar?: string;
  userName?: string;
  rightContent?: ReactNode;
  onBackClick?: () => void;
}

const Header: FC<HeaderProps> = (props) => {
  const {
    className,
    titleWrapperClassName,
    title,
    userAvatar,
    userName,
    onBackClick,
    titleActionElement,
    rightContent,
  } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <ButtonIcon onClick={onBackClick}>
        <RightArrowThinIcon className={styles.openSidenavIcon} />
      </ButtonIcon>
      {userAvatar && (
        <UserAvatar
          className={styles.userAvatar}
          photoURL={userAvatar}
          nameForRandomAvatar={userName}
          userName={userName}
        />
      )}
      <p className={classNames(styles.titleWrapper, titleWrapperClassName)}>
        <span className={styles.title}>{title}</span> {titleActionElement}
      </p>
      <div className={styles.rightContent}>{rightContent}</div>
    </div>
  );
};

export default Header;
