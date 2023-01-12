import { useCallback, useState } from "react";

export const useForceUpdate = (): (() => void) => {
  const [, setState] = useState(true);

  return useCallback(() => {
    setState((s) => !s);
  }, []);
};
