import React, { FC } from "react";
import styles from "./KeyValuePair.module.scss";

interface KeyValuePairProps {
  name: string;
  value: string;
}

const KeyValuePair: FC<KeyValuePairProps> = (props) => {
  const { name, value } = props;

  return (
    <div className={styles.container}>
      <dt className={styles.key}>{name}</dt>
      <dd className={styles.value}>{value}</dd>
    </div>
  );
};

export default KeyValuePair;
