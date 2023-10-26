import { CSSProperties, RefObject } from "react";

const getFixedMenuStyles = (
  ref: RefObject<HTMLElement>,
  menuRef: HTMLUListElement | null,
): CSSProperties | undefined => {
  if (!ref.current || !menuRef) {
    return;
  }

  const { top, left, height } = ref.current.getBoundingClientRect();
  const menuRect = menuRef.getBoundingClientRect();
  const bottom = top + height + menuRect.height;
  const styles: CSSProperties = {
    left,
    top: top + height,
  };

  if (window.innerHeight < bottom) {
    styles.top = top - menuRect.height;
  }
  if (styles.top && Number(styles.top) < 0) {
    styles.top = 0;
    styles.bottom = 0;
    styles.maxHeight = "100%";
  }

  return styles;
};

export const getMenuStyles = (
  ref: RefObject<HTMLElement>,
  menuRef: HTMLUListElement | null,
  chatContentRect?: DOMRect,
  shouldBeFixed?: boolean,
): CSSProperties | undefined => {
  if (!menuRef) {
    return;
  }
  if (shouldBeFixed) {
    return getFixedMenuStyles(ref, menuRef);
  }

  const styles: CSSProperties = {};
  const { right, height } = menuRef.getBoundingClientRect();

  if (window.innerWidth < right) {
    styles.right = 0;
  }

  if (ref.current && chatContentRect) {
    const { bottom: menuButtonBottom, height: menuButtonHeight } =
      ref.current.getBoundingClientRect();
    const menuBottom = menuButtonBottom + height;

    if (chatContentRect.bottom < menuBottom) {
      styles.bottom = menuButtonHeight;
    }
  }

  return styles;
};
