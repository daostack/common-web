import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Image } from "@/shared/components/Image";
import styles from "./Content.module.scss";

interface Element {
  button: HTMLButtonElement;
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
    <Tag ref={ref} className={styles.menuButton} {...restProps}>
      <Image
        className={styles.avatar}
        src={avatarURL}
        alt={userName ? `${userName}'s avatar` : "User's avatar"}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <span className={styles.name}>{userName}</span>
      {leftSideEl}
    </Tag>
  );
}

export default forwardRef(Content);
