import { useEffect } from "react";

export const usePreventReload = (shouldPrevent = true): void => {
  useEffect(() => {
    if (!shouldPrevent) {
      return;
    }

    const handlePrevent = (event) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handlePrevent);

    return () => {
      window.removeEventListener("beforeunload", handlePrevent);
    };
  }, [shouldPrevent]);
};
