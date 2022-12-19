import React, {
  ForwardRefRenderFunction,
  HTMLProps,
  forwardRef,
  isValidElement,
  cloneElement,
  useMemo,
} from "react";
import { mergeRefs } from "react-merge-refs";
import { TooltipState } from "../../constants";
import { useTooltipContext } from "../../context";

interface TooltipTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}

const TooltipTrigger: ForwardRefRenderFunction<
  HTMLElement,
  TooltipTriggerProps
> = (props, propRef) => {
  const { children, asChild = false, ...restProps } = props;
  const state = useTooltipContext();

  const childrenRef = (children as any).ref;
  const ref = useMemo(
    () => mergeRefs([state.reference, propRef, childrenRef]),
    [state.reference, propRef, childrenRef],
  );

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      state.getReferenceProps({
        ref,
        ...restProps,
        ...children.props,
        "data-state": state.open ? TooltipState.Open : TooltipState.Closed,
      }),
    );
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-state={state.open ? TooltipState.Open : TooltipState.Closed}
      {...state.getReferenceProps(restProps)}
    >
      {children}
    </button>
  );
};

export default forwardRef(TooltipTrigger);
