import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { NavigationItemType, NavigationItemOptions } from "../../types";
import styles from "./NavigationItem.module.scss";

type NavigationItemProps = NavigationItemOptions;

const NavigationItem: FC<NavigationItemProps> = (props) => {
  const {
    text,
    route,
    icon,
    type = NavigationItemType.Link,
    isActive = false,
    isDisabled = false,
    notificationsAmount,
  } = props;
  const itemClassName = classNames(styles.item, {
    [styles.itemActive]: isActive,
    [styles.itemDisabled]: isDisabled,
  });

  const Wrapper: FC = ({ children }) => {
    if (type === NavigationItemType.Block || isDisabled) {
      return <div className={itemClassName}>{children}</div>;
    }

    return (
      <NavLink className={itemClassName} to={route}>
        {children}
      </NavLink>
    );
  };

  return (
    <Wrapper>
      <div className={styles.textWrapper}>
        {icon}
        <span className={styles.text}>{text}</span>
      </div>
      {typeof notificationsAmount === "number" && (
        <span>{notificationsAmount}</span>
      )}
    </Wrapper>
  );
};

export default NavigationItem;
