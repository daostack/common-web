import React, {
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useLayoutEffect,
} from "react";
import { useId } from "@floating-ui/react-dom-interactions";
import { usePopoverContext } from "../../context";

const PopoverDescription: ForwardRefRenderFunction<
  HTMLParagraphElement,
  HTMLProps<HTMLParagraphElement>
> = (props, ref) => {
  const { children, ...restProps } = props;
  const { setDescriptionId } = usePopoverContext();
  const id = useId();

  // Only sets `aria-describedby` on the Popover root element
  // if this component is mounted inside it.
  useLayoutEffect(() => {
    setDescriptionId(id);

    return () => setDescriptionId(undefined);
  }, [id, setDescriptionId]);

  return (
    <p {...restProps} ref={ref} id={id}>
      {children}
    </p>
  );
};

export default forwardRef(PopoverDescription);
