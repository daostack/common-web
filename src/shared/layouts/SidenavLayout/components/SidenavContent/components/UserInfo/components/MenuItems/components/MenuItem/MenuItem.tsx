import React, {
  cloneElement,
  forwardRef,
  ForwardRefRenderFunction,
  isValidElement,
  MouseEventHandler,
  ReactNode,
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
  let iconEl: ReactNode | null = null;

  if (isValidElement(item.icon)) {
    iconEl = cloneElement(item.icon, {
      ...item.icon.props,
      className: classNames(styles.icon, item.icon.props.className),
    });
  }

  const className = classNames(styles.item, item.className, {
    [styles.itemActive]: active,
  });
  const content = (
    <>
      {iconEl}
      {item.text}
    </>
  );

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
