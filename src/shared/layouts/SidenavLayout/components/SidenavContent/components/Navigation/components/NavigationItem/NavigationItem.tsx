import React, { FC } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { ExcavatorIcon } from "@/shared/icons";
import { NavigationItemType, NavigationItemOptions } from "../../types";
import styles from "./NavigationItem.module.scss";

type NavigationItemProps = NavigationItemOptions;

const NavigationItem: FC<NavigationItemProps> = (props) => {
  const { text, route, disabled, type = NavigationItemType.Link } = props;
  const itemClassName = classNames(styles.item, {
    [styles.itemDisabled]: disabled,
  });

  const Wrapper: FC = ({ children }) => {
    if (type === NavigationItemType.Block || disabled) {
      return (
        <div className={itemClassName} aria-disabled={disabled}>
          {children}
        </div>
      );
    }

    return (
      <NavLink className={itemClassName} to={route}>
        {children}
      </NavLink>
    );
  };

  return (
    <Wrapper>
      <span>{text}</span>
      {disabled && <ExcavatorIcon className={styles.icon} />}
    </Wrapper>
  );
};

export default NavigationItem;
