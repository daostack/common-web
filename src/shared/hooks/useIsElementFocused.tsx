import { useEffect, useState } from "react";

export const useIsElementFocused = (id: string) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleFocusChange = () => {
      const element = document.getElementById(id);
      setIsFocused(document.activeElement === element);
    };

    // Listen to focus changes globally
    document.addEventListener("focusin", handleFocusChange);
    document.addEventListener("focusout", handleFocusChange);

    // Cleanup
    return () => {
      document.removeEventListener("focusin", handleFocusChange);
      document.removeEventListener("focusout", handleFocusChange);
    };
  }, [id]);

  return isFocused;
};