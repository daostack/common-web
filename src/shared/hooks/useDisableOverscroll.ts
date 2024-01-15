import { useEffect } from "react";

export const useDisableOverscroll = () => {
  useEffect(() => {
    const originalOverscroll =
      document.documentElement.style.overscrollBehavior;
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overscrollBehavior = originalOverscroll;
    };
  }, []);
};
