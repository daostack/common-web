import React, { FC } from "react";
import classNames from "classnames";
import styles from "./CommonCard.module.scss";

interface CommonCardProps {
  className?: string;
}

const CommonCard: FC<CommonCardProps> = (props) => {
  const { className, children } = props;

  return (
    <section className={classNames(styles.container, className)}>
      {children}
    </section>
  );
};

export default CommonCard;
