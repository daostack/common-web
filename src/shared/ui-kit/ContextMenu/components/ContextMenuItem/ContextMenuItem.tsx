import React, {
  forwardRef,
  ForwardRefRenderFunction,
  MouseEventHandler,
  RefObject,
} from "react";
import classNames from "classnames";
import { ContextMenuItem as Item } from "@/shared/interfaces";
import styles from "./ContextMenuItem.module.scss";

interface ContextMenuItemProps {
  item: Item;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

const ContextMenuItem: ForwardRefRenderFunction<
  unknown,
  ContextMenuItemProps
> = (props, ref) => {
  const { item, ...restProps } = props;
  const content = item.text;
  const className = classNames(styles.item, item.className, {
    [styles.itemWithWarning]: item.withWarning,
  });
  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    item.onClick(event);

    if (restProps.onClick) {
      restProps.onClick(event);
    }
  };

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      {...restProps}
      className={className}
      onClick={handleClick}
      onMouseUp={handleClick}
      type="button"
      role="menuitem"
    >
      {content}
    </button>
  );
};

export default forwardRef(ContextMenuItem);
