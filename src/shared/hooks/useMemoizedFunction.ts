import { useCallback, useRef } from "react";

export const useMemoizedFunction = <T extends (...args: any[]) => any>(
  func: T,
): T => {
  const funcRef = useRef(func);
  funcRef.current = func;

  return useCallback<typeof funcRef.current>(
    // @ts-ignore
    (...args) => funcRef.current(...args),
    [funcRef],
  );
};
