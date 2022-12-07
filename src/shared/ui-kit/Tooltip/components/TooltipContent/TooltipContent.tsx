import React, {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useMemo,
} from "react";
import { mergeRefs } from "react-merge-refs";
import { FloatingPortal } from "@floating-ui/react-dom-interactions";
import { useTooltipContext } from "../../context";

const TooltipContent: ForwardRefRenderFunction<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
> = (props, propRef) => {
  const state = useTooltipContext();

  const ref = useMemo(
    () => mergeRefs([state.floating, propRef]),
    [state.floating, propRef],
  );

  return (
    <FloatingPortal>
      {state.open && (
        <div
          ref={ref}
          style={{
            position: state.strategy,
            top: state.y ?? 0,
            left: state.x ?? 0,
            visibility: state.x === null ? "hidden" : "visible",
            ...props.style,
          }}
          {...state.getFloatingProps(props)}
        />
      )}
    </FloatingPortal>
  );
};

export default forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  TooltipContent,
);
