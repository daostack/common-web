import React, { FC, MouseEventHandler } from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import { useTreeContext } from "../../context";
import { Item } from "../../types";
import { TreeItemTriggerContent } from "../TreeItemTriggerContent";
import styles from "./TreeItemTrigger.module.scss";

interface TreeItemTriggerProps {
  className?: string;
  item: Item;
  level: number;
  isActive: boolean;
  isOpen: boolean;
  onToggle?: () => void;
}

const TreeItemTrigger: FC<TreeItemTriggerProps> = (props) => {
  const { className, item, level, isActive, isOpen, onToggle } = props;
  const { treeItemTriggerStyles, onItemClick } = useTreeContext();
  const { hasMembership = true } = item;

  const handleToggle: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onToggle) {
      event.stopPropagation();
      event.preventDefault();
      onToggle();
    }
  };

  const handleItemClick: MouseEventHandler<HTMLDivElement> = () => {
    if (!item.disabled) {
      onItemClick?.(item.id);
    }
  };

  const wrapperClassName = classNames(
    styles.item,
    {
      [classNames(styles.itemActive, treeItemTriggerStyles?.containerActive)]:
        isActive,
      [styles.itemWithoutMembership]: !hasMembership,
      [classNames(
        styles.itemDisabled,
        treeItemTriggerStyles?.containerDisabled,
      )]: item.disabled,
    },
    className,
    treeItemTriggerStyles?.container,
  );

  if (onItemClick || item.disabled) {
    return (
      <div
        className={wrapperClassName}
        title={item.name}
        aria-label={`Select ${item.name}`}
        aria-disabled={item.disabled}
        tabIndex={0}
        onClick={handleItemClick}
      >
        <TreeItemTriggerContent
          isActive={isActive}
          treeItemTriggerStyles={treeItemTriggerStyles}
          item={item}
          level={level}
          isOpen={isOpen}
          handleToggle={handleToggle}
          onToggle={onToggle}
        />
      </div>
    );
  }

  return (
    <NavLink
      className={wrapperClassName}
      to={item.path}
      title={item.name}
      aria-label={`Go to ${item.name}`}
    >
      <TreeItemTriggerContent
        isActive={isActive}
        treeItemTriggerStyles={treeItemTriggerStyles}
        item={item}
        level={level}
        isOpen={isOpen}
        handleToggle={handleToggle}
        onToggle={onToggle}
      />
    </NavLink>
  );
};

export default TreeItemTrigger;
