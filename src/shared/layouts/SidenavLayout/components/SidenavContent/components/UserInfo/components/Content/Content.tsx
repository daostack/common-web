import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  ReactNode,
} from "react";
import classNames from "classnames";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { UserAvatar } from "@/shared/components/UserAvatar";
import styles from "./Content.module.scss";

interface Element {
  button: HTMLButtonElement;
  div: HTMLDivElement;
}

export interface ContentStyles {
  container?: string;
  userAvatar?: string;
  userName?: string;
  loginButton?: string;
}

interface ContentProps<T> {
  as?: T;
  avatarURL?: string;
  userName?: string;
  leftSideEl?: ReactNode;
  styles?: ContentStyles;
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
    styles: outerStyles,
    ...restProps
  } = props;
  const Tag = as;

  return (
    // @ts-ignore
    <Tag
      ref={ref}
      className={classNames(styles.menuButton, outerStyles?.container)}
      {...restProps}
    >
      <div className={styles.contentWrapper}>
        <UserAvatar
          className={classNames(styles.avatar, outerStyles?.userAvatar)}
          photoURL={avatarURL}
          userName={userName}
          preloaderSrc={avatarPlaceholderSrc}
        />
        <span className={classNames(styles.name, outerStyles?.userName)}>
          {userName}
        </span>
        {leftSideEl}
      </div>
    </Tag>
  );
}

export default forwardRef(Content);
