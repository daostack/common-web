import React, { FC } from "react";
import classNames from "classnames";
import styles from "./CommonCard.module.scss";

interface CommonCardProps {
  className?: string;
  hideCardStyles?: boolean;
}

const CommonCard: FC<CommonCardProps> = (props) => {
  const { className, hideCardStyles = false, children } = props;

  return (
    <section
      className={classNames(styles.container, className, {
        [styles.containerWithCardStyles]: !hideCardStyles,
      })}
    >
      {children}
    </section>
  );
};

export default CommonCard;
