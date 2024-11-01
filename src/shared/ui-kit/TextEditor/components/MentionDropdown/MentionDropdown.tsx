import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { uniq } from "lodash";
import { UserAvatar } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useOutsideClick } from "@/shared/hooks";
import { Discussion, User } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import styles from "./MentionDropdown.module.scss";

export const MENTION_TAG = "@";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  onClickDiscussion: (discussion: Discussion) => void;
  discussions?: Discussion[];
  onClose: () => void;
  users?: User[];
  shouldFocusTarget?: boolean;
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const {
    onClick,
    onClickDiscussion,
    users = [],
    discussions = [],
    onClose,
    shouldFocusTarget,
  } = props;
  const mentionRef = useRef(null);
  const listRefs = useRef<HTMLLIElement[]>([]);
  const { isOutside, setOutsideValue } = useOutsideClick(mentionRef);
  const [index, setIndex] = useState(0);

  const userIds = useMemo(() => users.map(({ uid }) => uid), [users]);
  const discussionIds = useMemo(() => discussions.map(({ id }) => id), [discussions]);

  useEffect(() => {
    if (shouldFocusTarget) {
      const filteredListRefs = uniq(listRefs.current).filter((item) => {
        if (userIds.includes(item?.id) || discussionIds.includes(item?.id)) {
          return true;
        }

        return false;
      });

      listRefs.current = filteredListRefs;
      filteredListRefs && filteredListRefs?.[index]?.focus();
    }
  }, [index, shouldFocusTarget, userIds, discussionIds]);

  const increment = () => {
    setIndex((value) => {
      const updatedValue = value + 1;
      const usersLastIndex = users.length - 1;
      const discussionsLastIndex = discussions.length - 1;
      return updatedValue > discussionsLastIndex + usersLastIndex ? value : updatedValue;
    });
  };
  const decrement = () =>
    setIndex((value) => {
      const updatedValue = value - 1;
      return updatedValue >= 0 ? updatedValue : value;
    });

  useEffect(() => {
    if (isOutside) {
      onClose();
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue, onClose]);

  const onKeyDown = (event) => {
    event.preventDefault();
    switch (event.key) {
      case KeyboardKeys.ArrowUp: {
        decrement();
        break;
      }
      case KeyboardKeys.ArrowDown: {
        increment();
        break;
      }
      case KeyboardKeys.Enter: {
        if(index > users.length - 1) {
          onClickDiscussion(discussions[index - users.length]);
        } else {
          onClick(users[index]);
        }
      }
    }
  };

  const getRef = (element) => listRefs.current.push(element);

  return (
    <ul
      tabIndex={0}
      ref={mentionRef}
      className={styles.container}
      data-cy="mentions-portal"
      onKeyDown={onKeyDown}
    >
      {(users.length === 0 && discussions.length === 0) && (
        <li className={styles.content}>
          <Loader className={styles.loader} />
        </li>
      )}
      {users.map((user, index) => (
        <li
          id={user.uid}
          ref={getRef}
          tabIndex={index}
          key={user.uid}
          onClick={() => onClick(user)}
          className={styles.content}
        >
          <UserAvatar
            className={styles.userAvatar}
            userName={getUserName(user)}
            photoURL={user?.photo || user?.photoURL}
          />
          <p className={styles.userName}>{getUserName(user)}</p>
        </li>
      ))}
      {discussions.map((discussion, index) => (
        <li
          id={discussion.id}
          ref={getRef}
          tabIndex={index}
          key={discussion.id}
          onClick={() => onClickDiscussion(discussion)}
          className={styles.content}
        >
          <UserAvatar
            className={styles.userAvatar}
            userName={discussion.title}
            photoURL={discussion.images?.[0]?.value}
          />
          <p className={styles.userName}>{discussion.title}</p>
        </li>
      ))}
    </ul>
  );
};

export default MentionDropdown;
