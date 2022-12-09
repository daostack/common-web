import React, { FC, ReactNode } from "react";
import { TooltipContext } from "./context";
import { useTooltip } from "./hooks";
import { TooltipOptions } from "./types";

interface TooltipProps extends TooltipOptions {
  children: ReactNode;
}

const Tooltip: FC<TooltipProps> = ({ children, ...options }) => {
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const tooltip = useTooltip(options);

  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
};

export default Tooltip;
