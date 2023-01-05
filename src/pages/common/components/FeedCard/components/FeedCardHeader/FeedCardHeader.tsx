import React from "react";
import classNames from "classnames";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { MenuButton, UserAvatar } from "@/shared/components";
import styles from "./FeedCardHeader.module.scss";

export interface FeedCardHeaderProps {
  avatar?: string;
  title: string;
  createdAt: string;
  type: string;
  circleVisibility?: string;
}

export const FeedCardHeader: React.FC<FeedCardHeaderProps> = (props) => {
  const {
    avatar = avatarPlaceholderSrc,
    title,
    createdAt,
    type,
    circleVisibility,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <UserAvatar
          className={styles.avatar}
          photoURL={avatar}
          userName={title}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <div>
          <p className={classNames(styles.title, styles.text)}>{title}</p>
          <p className={classNames(styles.createdAt, styles.text)}>
            {createdAt}
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div>
          <p className={classNames(styles.entityType, styles.text)}>{type}</p>
          {circleVisibility && (
            <p className={classNames(styles.visibility, styles.text)}>
              {circleVisibility}
            </p>
          )}
        </div>
        <MenuButton className={styles.threeDotMenu} />
      </div>
    </div>
  );
};
