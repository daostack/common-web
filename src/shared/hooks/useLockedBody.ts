import { useCallback, useEffect, useLayoutEffect, useState } from "react";

interface Return {
  lockBodyScroll: () => void;
  unlockBodyScroll: () => void;
}

const useLockedBody = (initialLocked = false, rootId = "root"): Return => {
  const [locked, setLocked] = useState(initialLocked);

  const lockBodyScroll = useCallback(() => {
    setLocked(true);
  }, []);

  const unlockBodyScroll = useCallback(() => {
    setLocked(false);
  }, []);

  // Do the side effect before render
  useLayoutEffect(() => {
    if (!locked) {
      return;
    }

    // Save initial body style
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = parseInt(
      window.getComputedStyle(document.body).getPropertyValue("padding-right"),
      10,
    );

    // Get the scrollBar width
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Avoid width reflow
    if (scrollBarWidth) {
      document.body.style.paddingRight = `${
        originalPaddingRight + scrollBarWidth
      }px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        document.body.style.paddingRight = `${originalPaddingRight}px`;
      }
    };
  }, [locked]);

  // Update state if initialValue changes
  useEffect(() => {
    if (locked !== initialLocked) {
      setLocked(initialLocked);
    }
  }, [initialLocked]);

  return {
    lockBodyScroll,
    unlockBodyScroll,
  };
};

export default useLockedBody;
