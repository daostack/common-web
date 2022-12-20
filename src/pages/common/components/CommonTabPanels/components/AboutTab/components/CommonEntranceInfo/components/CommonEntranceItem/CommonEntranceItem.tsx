import React, { FC, useCallback } from "react";
import { PaymentAmount } from "@/shared/models";
import { formatPriceEntrance } from "@/shared/utils";
import styles from "./CommonEntranceItem.module.scss";

interface CommonEntranceItemProps {
  text: string;
  amount?: PaymentAmount;
  bySubscription?: boolean;
}

const CommonEntranceItem: FC<CommonEntranceItemProps> = (props) => {
  const { text, amount, bySubscription = false } = props;

  const ItemValue = useCallback(() => {
    if (!amount) {
      return null;
    }

    const formattedAmount = formatPriceEntrance(amount, { bySubscription });
    const formattedFullAmount = formatPriceEntrance(amount, {
      bySubscription,
      shouldMillify: false,
    });

    return (
      <dd className={styles.itemValue} title={formattedFullAmount}>
        {formattedAmount}
      </dd>
    );
  }, [amount]);

  return (
    <div className={styles.item}>
      <dt className={styles.itemLabel}>{text}</dt>
      <ItemValue />
    </div>
  );
};

export default CommonEntranceItem;
