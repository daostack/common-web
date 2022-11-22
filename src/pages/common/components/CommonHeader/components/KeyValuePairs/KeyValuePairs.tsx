import React, { FC } from "react";
import { KeyValuePair } from "../KeyValuePair";
import styles from "./KeyValuePairs.module.scss";

const KeyValuePairs: FC = () => {
  return (
    <dl className={styles.list}>
      <KeyValuePair />
    </dl>
  );
};

export default KeyValuePairs;
