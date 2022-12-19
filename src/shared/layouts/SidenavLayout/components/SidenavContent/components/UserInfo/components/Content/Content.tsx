import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components/UserAvatar";
import styles from "./Content.module.scss";

interface Element {
  button: HTMLButtonElement;
  div: HTMLDivElement;
}

interface ContentProps<T> {
  as?: T;
  avatarURL?: string;
  userName?: string;
  leftSideEl?: ReactNode;
}

function Content<T extends keyof Element>(
  props: ContentProps<T>,
  ref: ForwardedRef<Element[T]>,
): ReactElement {
  const {
    as = "button",
    avatarURL = avatarPlaceholderSrc,
    userName,
    leftSideEl,
    ...restProps
  } = props;
  const Tag = as;

  return (
    // @ts-ignore
    <Tag ref={ref} className={styles.menuButton} {...restProps}>
      <UserAvatar
        className={styles.avatar}
        photoURL={avatarURL}
        userName={userName}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <span className={styles.name}>{userName}</span>
      {leftSideEl}
    </Tag>
  );
}

export default forwardRef(Content);
