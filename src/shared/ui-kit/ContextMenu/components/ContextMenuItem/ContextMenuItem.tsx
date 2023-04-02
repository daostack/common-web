import React, {
  forwardRef,
  ForwardRefRenderFunction,
  MouseEventHandler,
  RefObject,
} from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import {
  ContextMenuItem as Item,
  ContextMenuItemType as ItemType,
} from "../../types";
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

  switch (item.type) {
    case ItemType.Link:
      return (
        <NavLink
          ref={ref as RefObject<HTMLAnchorElement>}
          {...restProps}
          className={className}
          to={item.to}
          role="menuitem"
        >
          {content}
        </NavLink>
      );
    default:
      return (
        <button
          ref={ref as RefObject<HTMLButtonElement>}
          {...restProps}
          className={className}
          onClick={(event) => {
            item.onClick(event);

            if (restProps.onClick) {
              restProps.onClick(event);
            }
          }}
          type="button"
          role="menuitem"
        >
          {content}
        </button>
      );
  }
};

export default forwardRef(ContextMenuItem);
