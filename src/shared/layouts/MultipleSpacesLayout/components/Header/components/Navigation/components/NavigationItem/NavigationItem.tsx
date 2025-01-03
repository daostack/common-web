import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui-kit";
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
    tooltipContent,
    onClick,
  } = props;
  const itemClassName = classNames(styles.item, {
    [styles.itemActive]: isActive,
    [styles.itemDisabled]: isDisabled,
  });

  const Wrapper: FC = ({ children }) => {
    let triggerEl: ReactNode;

    if (type === NavigationItemType.Block || isDisabled) {
      triggerEl = <div className={itemClassName}>{children}</div>;
    } else if (onClick) {
      triggerEl = (
        <button className={itemClassName} onClick={onClick}>
          {children}
        </button>
      );
    } else {
      triggerEl = (
        <NavLink className={itemClassName} to={route}>
          {children}
        </NavLink>
      );
    }
    if (tooltipContent) {
      triggerEl = (
        <Tooltip placement="bottom">
          <TooltipTrigger asChild>{triggerEl}</TooltipTrigger>
          <TooltipContent className={styles.tooltipContent}>
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <>{triggerEl}</>;
  };

  return (
    <Wrapper>
      <div className={styles.textWrapper}>
        {icon}
        <span className={styles.text}>{text}</span>
      </div>
    </Wrapper>
  );
};

export default NavigationItem;
