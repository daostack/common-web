import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import { uniq } from "lodash";
import { UserAvatar } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useOutsideClick } from "@/shared/hooks";
import { User } from "@/shared/models";
import { Loader } from "@/shared/ui-kit";
import { getUserName } from "@/shared/utils";
import styles from "./MentionDropdown.module.scss";

export const MENTION_TAG = "@";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  onClose: () => void;
  users?: User[];
  shouldFocusTarget?: boolean;
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const {
    onClick,
    users = [],
    onClose,
    shouldFocusTarget,
  } = props;
  const mentionRef = useRef(null);
  const listRefs = useRef<HTMLLIElement[]>([]);
  const { isOutside, setOutsideValue } = useOutsideClick(mentionRef);
  const [index, setIndex] = useState(0);

  const userIds = useMemo(() => users.map(({ uid }) => uid), [users]);

  useEffect(() => {
    if (shouldFocusTarget) {
      const filteredListRefs = uniq(listRefs.current).filter((item) => {
        if (userIds.includes(item?.id)) {
          return true;
        }

        return false;
      });

      listRefs.current = filteredListRefs;
      filteredListRefs && filteredListRefs?.[index]?.focus();
    }
  }, [index, shouldFocusTarget, userIds]);

  const increment = () => {
    setIndex((value) => {
      const updatedValue = value + 1;
      return updatedValue > users.length - 1 ? value : updatedValue;
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
        onClick(users[index]);
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
      {users.length === 0 && (
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
    </ul>
  );
};

export default MentionDropdown;
