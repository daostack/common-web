import React, { FC, useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/shared/components";
import { useOutsideClick } from "@/shared/hooks";
import { User } from "@/shared/models";
import styles from "./MentionDropdown.module.scss";

export interface MentionDropdownProps {
  onClick: (user: User) => void;
  onClose: () => void;
  users?: User[];
}

const MentionDropdown: FC<MentionDropdownProps> = (props) => {
  const { onClick, users = [], onClose } = props;
  const mentionRef = useRef<HTMLUListElement>(null);
  const listRefs = useRef<HTMLLIElement[]>([]);
  const { isOutside, setOutsideValue } = useOutsideClick(mentionRef);
  const [index, setIndex] = useState(0);

  // useEffect(() => {
  //   listRefs && listRefs.current?.[index]?.focus();
  // }, [index]);

  const increment = () => setIndex((value) => value + 1);
  const decrement = () => setIndex((value) => value - 1);
  const chooseUser = () => {
    onClick(users[index]);
  };

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
          case "ArrowUp": {
            decrement();
            break;
          }
          case "ArrowDown": {
            increment();
            break;
          }
          case "Enter": {
            chooseUser();
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
