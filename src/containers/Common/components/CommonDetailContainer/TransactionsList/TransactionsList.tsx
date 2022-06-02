import React, { FC } from "react";
import { TransactionData } from "@/shared/models";
import { TransactionsListItem } from "./";
import "./index.scss";

interface TransactionsListProps {
  transactions: TransactionData[];
}

const TransactionsList: FC<TransactionsListProps> = ({ transactions }) =>
  (
    transactions.length
    ? <div className="transactions-list">
        {
          transactions.map(
            transactionData =>
              <TransactionsListItem
                key={transactionData.createdAt.seconds}
                transaction={transactionData}
              />
          )
        }
      </div>
    : <div className="transactions-list-empty-set">No transactions yet</div>
  );

export default TransactionsList;
