import React from "react";
import classNames from "classnames";
import { UserAvatar } from "@/shared/components";
import { useFullText } from "@/shared/hooks";
import styles from "./FeedInfoHeader.module.scss";

interface FeedInfoHeaderProps {
  title: string;
  userAvatars: string[];
  createdAt?: string;
}

export const FeedInfoHeader: React.FC<FeedInfoHeaderProps> = ({
  title,
  userAvatars,
  createdAt,
}) => {
  const {
    ref: titleRef,
    shouldShowFullText,
    isFullTextShowing,
    toggleFullText,
  } = useFullText();

  return (
    <div className={styles.container}>
      <div className={styles.avatarContainer}>
        {userAvatars.map((avatar, index) => (
          <div
            className={classNames(styles.avatarContent, {
              [styles.avatarContentMultiple]: index > 0,
            })}
          >
            <UserAvatar
              className={classNames(styles.avatar, {
                [styles.avatarMultiple]: index > 0,
              })}
              photoURL={avatar}
            />
          </div>
        ))}
      </div>
      <div>
        <p
          ref={titleRef}
          className={classNames(styles.text, styles.title, {
            [styles.titleShortened]: !shouldShowFullText,
          })}
        >
          {title}
        </p>
        {(shouldShowFullText || !isFullTextShowing) && (
          <a
            className={classNames(styles.seeMore, styles.text)}
            onClick={toggleFullText}
          >
            See {shouldShowFullText ? "less" : "more"}
          </a>
        )}
        <p className={classNames(styles.createdAt, styles.text)}>{createdAt}</p>
      </div>
    </div>
  );
};
