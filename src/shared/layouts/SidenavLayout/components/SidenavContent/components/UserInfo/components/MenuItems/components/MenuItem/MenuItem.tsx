import React, {
  forwardRef,
  ForwardRefRenderFunction,
  MouseEventHandler,
  RefObject,
} from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { Item, ItemType } from "../../types";
import styles from "./MenuItem.module.scss";

interface MenuItemProps {
  item: Item;
  active: boolean;
  // This is passed by Menu.Item and we should call it if we override onClick
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}
const MenuItem: ForwardRefRenderFunction<unknown, MenuItemProps> = (
  props,
  ref,
) => {
  const { item, active, ...restProps } = props;
  const content = item.text;
  const className = classNames(styles.item, {
    [styles.itemActive]: active,
  });

  switch (item.type) {
    case ItemType.Button:
      return (
        <button
          ref={ref as RefObject<HTMLButtonElement>}
          {...restProps}
          className={className}
          onClick={(...args) => {
            item.onClick();

            if (restProps.onClick) {
              restProps.onClick(...args);
            }
          }}
        >
          {content}
        </button>
      );
    default:
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
  }
};

export default forwardRef(MenuItem);
