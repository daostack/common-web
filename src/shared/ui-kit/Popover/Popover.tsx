import React, { FC, ReactNode } from "react";
import { PopoverContext } from "./context";
import { usePopover } from "./hooks";
import { PopoverOptions } from "./types";

interface PopoverProps extends PopoverOptions {
  children: ReactNode;
}

export const Popover: FC<PopoverProps> = (props) => {
  const { children, modal = false, ...restOptions } = props;
  // This can accept any props as options, e.g. `placement`,
  // or other positioning options.
  const popover = usePopover({ modal, ...restOptions });

  return (
    <PopoverContext.Provider value={popover}>
      {children}
    </PopoverContext.Provider>
  );
};
