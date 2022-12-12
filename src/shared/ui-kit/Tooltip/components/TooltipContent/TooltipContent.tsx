import React, {
  CSSProperties,
  forwardRef,
  ForwardRefRenderFunction,
  HTMLProps,
  useMemo,
} from "react";
import { mergeRefs } from "react-merge-refs";
import classNames from "classnames";
import { FloatingPortal } from "@floating-ui/react-dom-interactions";
import { CaretIcon } from "@/shared/icons";
import { useTooltipContext } from "../../context";
import styles from "./TooltipContent.module.scss";

const TooltipContent: ForwardRefRenderFunction<
  HTMLDivElement,
  HTMLProps<HTMLDivElement>
> = (props, propRef) => {
  const state = useTooltipContext();
  const { children, ...containerProps } = state.getFloatingProps(props);
  const [side] = state.placement.split("-");
  const arrowData = state.middlewareData.arrow;
  const containerClassName = classNames(
    styles.container,
    typeof containerProps.className === "string"
      ? containerProps.className
      : undefined,
  );
  const rotation = {
    top: "0deg",
    bottom: "180deg",
    left: "-90deg",
    right: "90deg",
  }[side];
  const arrowStyles: CSSProperties = {
    left: typeof arrowData?.x !== "undefined" ? `${arrowData.x}px` : "",
    top: typeof arrowData?.y !== "undefined" ? `${arrowData.y}px` : "",
    [side]: "100%",
    transform: `rotate(${rotation})`,
  };

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
          {...containerProps}
          className={containerClassName}
        >
          {children}
          <div
            ref={state.arrowRef}
            className={styles.arrowWrapper}
            style={arrowStyles}
          >
            <CaretIcon />
          </div>
        </div>
      )}
    </FloatingPortal>
  );
};

export default forwardRef<HTMLDivElement, HTMLProps<HTMLDivElement>>(
  TooltipContent,
);
