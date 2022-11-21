import { useCallback, useLayoutEffect, useState } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

interface Return {
  setTargetEl: (HTMLElement) => void;
  lockBodyScroll: () => void;
  unlockBodyScroll: () => void;
}

const useLockedBody = (isLocked?: boolean): Return => {
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  const lockBodyScroll = useCallback(() => {
    if (targetEl) {
      disableBodyScroll(targetEl, {
        reserveScrollBarGap: true,
      });
    }
  }, [targetEl]);

  const unlockBodyScroll = useCallback(() => {
    if (targetEl) {
      enableBodyScroll(targetEl);
    }
  }, [targetEl]);

  useLayoutEffect(() => {
    if (!targetEl || !isLocked) {
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [targetEl, isLocked]);

  return {
    setTargetEl,
    lockBodyScroll,
    unlockBodyScroll,
  };
};

export default useLockedBody;
