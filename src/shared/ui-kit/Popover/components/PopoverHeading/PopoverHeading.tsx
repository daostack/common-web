import React, {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useLayoutEffect,
} from "react";
import { useId } from "@floating-ui/react-dom-interactions";
import { usePopoverContext } from "../../context";

const PopoverHeading: ForwardRefRenderFunction<
  HTMLHeadingElement,
  HTMLProps<HTMLHeadingElement>
> = (props, ref) => {
  const { children, ...restProps } = props;
  const { setLabelId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-labelledby` on the Popover root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setLabelId(id);

    return () => setLabelId(undefined);
  }, [id, setLabelId]);

  return (
    <h2 {...restProps} ref={ref} id={id}>
      {children}
    </h2>
  );
};

export default forwardRef(PopoverHeading);
