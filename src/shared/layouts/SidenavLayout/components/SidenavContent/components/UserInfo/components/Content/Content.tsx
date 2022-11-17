import React, { ForwardRefRenderFunction, forwardRef, RefObject } from "react";
import avatarPlaceholderSrc from "@/shared/assets/images/avatar-placeholder.svg";
import { Image } from "@/shared/components";
import { useIsTabletView } from "@/shared/hooks/viewport";
import { RightArrowThinIcon, SmallArrowIcon } from "@/shared/icons";
import styles from "./Content.module.scss";

interface ContentProps {
  avatarURL?: string;
  userName?: string;
}

const Content: ForwardRefRenderFunction<unknown, ContentProps> = (
  props,
  ref,
) => {
  const { avatarURL = avatarPlaceholderSrc, userName, ...restProps } = props;
  const isTabletView = useIsTabletView();
  const ArrowIcon = isTabletView ? RightArrowThinIcon : SmallArrowIcon;

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
      <ArrowIcon className={styles.arrowIcon} />
    </button>
  );
};

export default forwardRef(Content);
