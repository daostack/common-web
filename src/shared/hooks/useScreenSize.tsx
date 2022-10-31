import React, { useEffect, useState } from "react";

export default function useScreenSize(query: string): boolean {
  const [isMatches, setMatches] = useState(
    () => window.matchMedia(`(${query})`).matches,
  );

  useEffect(() => {
    const screenSize = window.matchMedia(`(${query})`);

    const handleScreenSizeChange = (screenSize: MediaQueryListEvent) => {
      setMatches(screenSize.matches);
    };

    // Condition is added to solve issue https://www.designcise.com/web/tutorial/how-to-fix-the-javascript-typeerror-matchmedia-addeventlistener-is-not-a-function
    if (screenSize.addEventListener) {
      screenSize.addEventListener("change", handleScreenSizeChange);
    } else {
      screenSize.addListener(handleScreenSizeChange);
    }

    return () => {
      if (screenSize.removeEventListener) {
        screenSize.removeEventListener("change", handleScreenSizeChange);
      } else {
        screenSize.removeListener(handleScreenSizeChange);
      }
    };
  }, [query]);

  return isMatches;
}
