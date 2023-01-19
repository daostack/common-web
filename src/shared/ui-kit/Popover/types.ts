import type { Placement } from "@floating-ui/react-dom-interactions";

export interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  fallbackStrategy?: "initialPlacement";
  modal?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
