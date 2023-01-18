import React, { forwardRef, ForwardRefRenderFunction, HTMLProps } from "react";
import classNames from "classnames";
import { useMergeRefs } from "@floating-ui/react";
import {
  FloatingPortal,
  FloatingFocusManager,
} from "@floating-ui/react-dom-interactions";
import { usePopoverContext } from "../../context";
import styles from "./PopoverContent.module.scss";

const PopoverContent: ForwardRefRenderFunction<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
> = (props, propRef) => {
  const { context: floatingContext, ...context } = usePopoverContext();
  const ref = useMergeRefs([context.floating, propRef]);
  const containerProps = context.getFloatingProps(props);
  const containerClassName = classNames(
    styles.container,
    typeof containerProps.className === "string"
      ? containerProps.className
      : undefined,
  );

  return (
    <FloatingPortal>
      {context.open && (
        <FloatingFocusManager context={floatingContext} modal={context.modal}>
          <div
            ref={ref}
            style={{
              position: context.strategy,
              top: context.y ?? 0,
              left: context.x ?? 0,
              ...props.style,
            }}
            aria-labelledby={context.labelId}
            aria-describedby={context.descriptionId}
            {...containerProps}
            className={containerClassName}
          >
            {props.children}
          </div>
        </FloatingFocusManager>
      )}
    </FloatingPortal>
  );
};

export default forwardRef(PopoverContent);
