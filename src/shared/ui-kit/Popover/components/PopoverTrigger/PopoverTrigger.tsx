import React, {
  ForwardRefRenderFunction,
  HTMLProps,
  forwardRef,
  isValidElement,
  cloneElement,
} from "react";
import { useMergeRefs } from "@floating-ui/react";
import { PopoverState } from "../../constants";
import { usePopoverContext } from "../../context";

interface PopoverTriggerProps extends HTMLProps<HTMLElement> {
  asChild?: boolean;
}

const PopoverTrigger: ForwardRefRenderFunction<
  HTMLElement,
  PopoverTriggerProps
> = (props, propRef) => {
  const { children, asChild = false, ...restProps } = props;
  const context = usePopoverContext();
  const childrenRef = (children as any).ref;
  const ref = useMergeRefs([context.reference, propRef, childrenRef]);
  const dataState = context.open ? PopoverState.Open : PopoverState.Closed;

  // `asChild` allows the user to pass any element as the anchor
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...restProps,
        ...children.props,
        "data-state": dataState,
      }),
    );
  }

  return (
    <button
      ref={ref}
      // The user can style the trigger based on the state
      data-state={dataState}
      {...context.getReferenceProps(restProps)}
    >
      {children}
    </button>
  );
};

export default forwardRef(PopoverTrigger);
