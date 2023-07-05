import React, { FC } from "react";
import classNames from "classnames";
import { RightArrowThinIcon } from "@/shared/icons";
import styles from "./Separator.module.scss";

interface SeparatorProps {
  className?: string;
  withoutContainer?: boolean;
}

const Separator: FC<SeparatorProps> = (props) => {
  const { className, withoutContainer = false } = props;

  if (withoutContainer) {
    return <RightArrowThinIcon className={className} />;
  }

  return (
    <li className={classNames(styles.container, className)}>
      <RightArrowThinIcon />
    </li>
  );
};

export default Separator;
