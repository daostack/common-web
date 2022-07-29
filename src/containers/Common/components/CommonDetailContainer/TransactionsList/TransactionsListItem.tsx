import React, { FC, useState, useEffect } from "react";
import classNames from "classnames";

import { getUserData } from "../../../../Auth/store/api";
import { Loader, UserAvatar } from "@/shared/components";
import {
  TransactionData,
  TransactionType,
  User,
  DateFormat,
} from "@/shared/models";
import { formatDate, formatPrice, getUserName } from "@/shared/utils";
import "./index.scss";

interface TransactionsListItemProps {
  transaction: TransactionData;
}

const TransactionsListItem: FC<TransactionsListItemProps> = (
  {
    transaction: {
      type,
      createdAt,
      amount,
      payerId,
      fundingRequestDescription,
    }
  }
) => {
  const [payerData, setPayerData] = useState<User | null>(null);

  useEffect(() => {
    (
      async () => {
        if (
          payerData
          || type !== TransactionType.PayIn
          || !payerId
        ) return;

        try {
          const payerData = await getUserData(payerId);

          setPayerData(payerData);
        } catch (error) {
          console.log(error);
        }
      }
    )();
  }, [payerData, setPayerData, type, payerId]);

  return (
    <div className="transaction__wrapper">
      <div className="transaction__content">
        <div className="transaction__main-info">
          <div
            className={
              classNames(
                "transaction__amount",
                {
                  "pay-in": (type === TransactionType.PayIn),
                  "pay-out": (type === TransactionType.PayOut),
                }
              )
            }
          >
            {
              `${(type === TransactionType.PayIn) ? "+ " : "- "}${formatPrice(amount)}`
            }
          </div>
          <div className="transaction__time">
            {
              formatDate(
                new Date(createdAt.seconds * 1000),
                DateFormat.LongHuman
              )
            }
          </div>
        </div>
        <div className="transaction__additional-info">
          {
            (type === TransactionType.PayIn)
              ? (
                payerData
                  ? <div className="transaction__payin-payer-data">
                    <UserAvatar
                      photoURL={payerData.photoURL}
                      nameForRandomAvatar={payerData.email}
                      userName={getUserName(payerData)}
                      className="payer-avatar"
                    />
                    <div className="payer-name">
                      {getUserName(payerData)}
                    </div>
                  </div>
                  : <Loader />
              )
              : (
                <div className="transaction__payout-description">
                  {fundingRequestDescription}
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};

export default TransactionsListItem;
