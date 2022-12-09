import { useMemo, useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react-dom-interactions";
import { TooltipOptions } from "../types";

export const useTooltip = (options: TooltipOptions = {}) => {
  const {
    initialOpen = false,
    placement = "top",
    open: controlledOpen,
    onOpenChange: setControlledOpen,
  } = options;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  const arrowRef = useRef<HTMLDivElement>(null);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(8),
      flip(),
      shift(),
      arrow({
        element: arrowRef,
      }),
    ],
  });

  const { context } = data;

  const hover = useHover(context, {
    move: false,
    enabled: typeof controlledOpen === "undefined",
  });
  const focus = useFocus(context, {
    enabled: typeof controlledOpen === "undefined",
  });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "tooltip" });

  const interactions = useInteractions([hover, focus, dismiss, role]);

  return useMemo(
    () => ({
      open,
      setOpen,
      arrowRef,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data, arrowRef],
  );
};
