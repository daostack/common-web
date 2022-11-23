import React, { FC } from "react";
import classNames from "classnames";
import styles from "./KeyValuePair.module.scss";

export interface KeyValueItem {
  id: string;
  name: string;
  value: string;
}

interface KeyValuePairProps extends Omit<KeyValueItem, "id"> {
  className?: string;
}

const KeyValuePair: FC<KeyValuePairProps> = (props) => {
  const { className, name, value } = props;

  return (
    <div className={classNames(styles.container, className)}>
      <dt className={styles.key}>{name}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
};

export default KeyValuePair;
