import React, { ReactNode } from "react";
import classNames from "classnames";
import styles from "./ElementDropdownItem.module.scss";

interface ElementDropdownItemProps {
  text: string;
  icon?: ReactNode;
  withWarning?: boolean;
}

const ElementDropdownItem = ({
  text,
  icon,
  withWarning,
}: ElementDropdownItemProps) => {
  return (
    <div
      className={classNames(styles.content, {
        [styles.withIcon]: icon,
        [styles.withWarning]: withWarning,
      })}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

export default ElementDropdownItem;
