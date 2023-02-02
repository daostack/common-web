import { useEffect } from "react";

export const usePreventReload = (
  shouldPrevent: boolean | (() => boolean) = true,
): void => {
  useEffect(() => {
    const handlePrevent = (event) => {
      if (
        typeof shouldPrevent === "function" ? shouldPrevent() : shouldPrevent
      ) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handlePrevent);

    return () => {
      window.removeEventListener("beforeunload", handlePrevent);
    };
  }, [shouldPrevent]);
};
