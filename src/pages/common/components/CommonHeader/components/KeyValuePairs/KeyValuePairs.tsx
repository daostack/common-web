import React, { FC } from "react";
import { KeyValuePair, KeyValueItem } from "../KeyValuePair";
import styles from "./KeyValuePairs.module.scss";

interface KeyValuePairsProps {
  items: KeyValueItem[];
}

const KeyValuePairs: FC<KeyValuePairsProps> = (props) => {
  const { items } = props;

  if (items.length === 0) {
    return null;
  }

  return (
    <dl className={styles.list}>
      {items.map((item) => (
        <KeyValuePair
          className={styles.item}
          key={item.id}
          name={item.name}
          value={item.value}
          valueHint={item.valueHint}
        />
      ))}
    </dl>
  );
};

export default KeyValuePairs;
