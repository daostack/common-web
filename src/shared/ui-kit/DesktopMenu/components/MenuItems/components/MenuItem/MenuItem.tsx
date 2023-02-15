import React, {
  forwardRef,
  ForwardRefRenderFunction,
  MouseEventHandler,
  RefObject,
} from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import {
  MenuItem as Item,
  MenuItemType as ItemType,
} from "@/shared/interfaces";
import styles from "./MenuItem.module.scss";

interface MenuItemProps {
  item: Item;
  active?: boolean;
  // This is passed by Menu.Item and we should call it if we override onClick
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}
const MenuItem: ForwardRefRenderFunction<unknown, MenuItemProps> = (
  props,
  ref,
) => {
  const { item, active = false, ...restProps } = props;
  const content = item.text;
  const className = classNames(styles.item, item.className, {
    [styles.itemActive]: active,
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
            event.stopPropagation();
            item.onClick();

            if (restProps.onClick) {
              restProps.onClick(event);
            }
          }}
          type="button"
        >
          {content}
        </button>
      );
  }
};

export default forwardRef(MenuItem);
