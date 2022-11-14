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
    const originalPaddingRight = document.body.style.paddingRight;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    // Get the scrollBar width
    const root = document.getElementById(rootId); // or root
    const scrollBarWidth = root ? root.offsetWidth - root.scrollWidth : 0;

    // Avoid width reflow
    if (scrollBarWidth) {
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;

      if (scrollBarWidth) {
        document.body.style.paddingRight = originalPaddingRight;
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
