import React, {
  ButtonHTMLAttributes,
  forwardRef,
  ForwardRefRenderFunction,
} from "react";
import { usePopoverContext } from "../../context";

const PopoverClose: ForwardRefRenderFunction<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
> = (props, ref) => {
  const { children, ...restProps } = props;
  const { setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      {...restProps}
      ref={ref}
      onClick={() => setOpen(false)}
    >
      {children}
    </button>
  );
};

export default forwardRef(PopoverClose);
