import React, {
  ForwardRefRenderFunction,
  forwardRef,
  RefObject,
  ReactNode,
} from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Image } from "@/shared/components";
import styles from "./Content.module.scss";

interface ContentProps {
  avatarURL?: string;
  userName?: string;
  leftSideEl?: ReactNode;
}

const Content: ForwardRefRenderFunction<unknown, ContentProps> = (
  props,
  ref,
) => {
  const {
    avatarURL = avatarPlaceholderSrc,
    userName,
    leftSideEl,
    ...restProps
  } = props;
  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      className={styles.menuButton}
      {...restProps}
    >
      <Image
        className={styles.avatar}
        src={avatarURL}
        alt={userName ? `${userName}'s avatar` : "User's avatar"}
        preloaderSrc={avatarPlaceholderSrc}
      />
      <span className={styles.name}>{userName}</span>
      {leftSideEl}
    </button>
  );
};

export default forwardRef(Content);
