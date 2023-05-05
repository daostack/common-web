import React, { FC, useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/shared/components";
import { KeyboardKeys } from "@/shared/constants/keyboardKeys";
import { useOutsideClick } from "@/shared/hooks";
import { User } from "@/shared/models";
import styles from "./MentionDropdown.module.scss";

export const MENTION_TAG = "@";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  onClose: () => void;
  users?: User[];
  shouldFocusTarget?: boolean;
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const { onClick, users = [], onClose, shouldFocusTarget } = props;
  const mentionRef = useRef(null);
  const listRefs = useRef<HTMLLIElement[]>([]);
  const { isOutside, setOutsideValue } = useOutsideClick(mentionRef);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (shouldFocusTarget) {
      listRefs && listRefs.current?.[index]?.focus();
    }
  }, [index, shouldFocusTarget]);

  const increment = () => {
    setIndex((value) => {
      const updatedValue = value + 1;
      return updatedValue > users.length - 1 ? value : value + 1;
    });
  };
  const decrement = () =>
    setIndex((value) => {
      const updatedValue = value - 1;
      return updatedValue > 0 ? updatedValue : value;
    });

  useEffect(() => {
    if (isOutside) {
      onClose();
      setOutsideValue();
    }
  }, [isOutside, setOutsideValue, onClose]);

  const getRef = (element) => listRefs.current.push(element);

  return (
    <ul
      tabIndex={0}
      ref={mentionRef}
      className={styles.container}
      data-cy="mentions-portal"
      onKeyDown={(event) => {
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
      }}
    >
      {users.map((user, index) => (
        <li
          ref={getRef}
          tabIndex={index}
          key={user.uid}
          onClick={() => onClick(user)}
          className={styles.content}
        >
          <UserAvatar
            className={styles.userAvatar}
            userName={user.displayName}
            photoURL={user?.photo || user?.photoURL}
          />
          <p className={styles.userName}>{user.displayName}</p>
        </li>
      ))}
    </ul>
  );
};

export default MentionDropdown;
