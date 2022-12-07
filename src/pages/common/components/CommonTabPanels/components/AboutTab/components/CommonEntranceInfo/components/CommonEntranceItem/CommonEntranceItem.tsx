import React, { FC } from "react";
import { PaymentAmount } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import styles from "./CommonEntranceItem.module.scss";

interface CommonEntranceItemProps {
  text: string;
  amount: PaymentAmount;
  bySubscription?: boolean;
}

const CommonEntranceItem: FC<CommonEntranceItemProps> = (props) => {
  const { text, amount, bySubscription = false } = props;
  const formattedAmount = formatPrice(amount, { bySubscription });
  const formattedFullAmount = formatPrice(amount, {
    bySubscription,
    shouldMillify: false,
  });

  return (
    <div className={styles.item}>
      <dt className={styles.itemLabel}>{text}</dt>
      <dd className={styles.itemValue} title={formattedFullAmount}>
        {formattedAmount}
      </dd>
    </div>
  );
};

export default CommonEntranceItem;
