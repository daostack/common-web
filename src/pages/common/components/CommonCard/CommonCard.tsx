import React, { FC } from "react";
import classNames from "classnames";
import styles from "./CommonCard.module.scss";

type CommonCardProps = JSX.IntrinsicElements["section"] & {
  hideCardStyles?: boolean;
};

const CommonCard: FC<CommonCardProps> = (props) => {
  const { className, hideCardStyles = false, ...restProps } = props;

  return (
    <section
      {...restProps}
      className={classNames(styles.container, className, {
        [styles.containerWithCardStyles]: !hideCardStyles,
      })}
    />
  );
};

export default CommonCard;
