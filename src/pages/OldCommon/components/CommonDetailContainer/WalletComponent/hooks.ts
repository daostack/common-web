import { useCallback } from "react";
import {
  TransactionData,
  TransactionType,
  Time,
  CommonTransactionsChartDataSet,
} from "@/shared/models";
import { getMonthsDifference } from "@/shared/utils";
import {
  BRIEF_MONTH_NAMES,
  TRANSACTIONS_PERIOD_MONTHS_AMOUNT,
} from "./constants";

interface UseCommonTransactionsChartDataReturn {
  getCommonTransactionsChartDataSet: (
    orderedCommonTransactions: TransactionData[],
    commonCreatedAt?: Time,
  ) => CommonTransactionsChartDataSet;
}

export const useCommonTransactionsChartDataSet =
  (): UseCommonTransactionsChartDataReturn => {
    const getCommonTransactionsChartDataSet = useCallback(
      (
        orderedCommonTransactions: TransactionData[],
        commonCreatedAt?: Time,
      ) => {
      //   const uniqueTransactionsMonths = new Set();

      //   const groupedByMonthPayInsSummaries: { [key: string]: number } = {};
      //   const groupedByMonthPayOutsSummaries: { [key: string]: number } = {};

      //   orderedCommonTransactions
      //     .filter(
      //       (transaction) =>
      //         getMonthsDifference(
      //           new Date(transaction.createdAt.seconds * 1000),
      //           new Date(),
      //         ) <= TRANSACTIONS_PERIOD_MONTHS_AMOUNT,
      //     )
      //     .map((transaction) => ({
      //       ...transaction,
      //       amount: transaction.amount / 100,
      //     }))
      //     .reverse()
      //     .map((transaction) => {
      //       const transactionMonthNotation =
      //         BRIEF_MONTH_NAMES[
      //           new Date(transaction.createdAt.seconds * 1000).getMonth()
      //         ];

      //       uniqueTransactionsMonths.add(transactionMonthNotation);

      //       if (
      //         groupedByMonthPayInsSummaries[transactionMonthNotation] ===
      //         undefined
      //       )
      //         groupedByMonthPayInsSummaries[transactionMonthNotation] = 0;

      //       if (
      //         groupedByMonthPayOutsSummaries[transactionMonthNotation] ===
      //         undefined
      //       )
      //         groupedByMonthPayOutsSummaries[transactionMonthNotation] = 0;

      //       if (transaction.type === TransactionType.PayIn) {
      //         groupedByMonthPayInsSummaries[transactionMonthNotation] +=
      //           transaction.amount;
      //       } else if (transaction.type === TransactionType.PayOut) {
      //         groupedByMonthPayOutsSummaries[transactionMonthNotation] +=
      //           transaction.amount;
      //       }

      //       return transaction;
      //     });

      //   const chartMonthLabelsList = Array.from(
      //     uniqueTransactionsMonths,
      //   ) as string[];

      //   /*
      //   FIXME: tempo decision to prevent common's crashing (some common-records have createdAt set in null),
      //   should be reverted after full merging of the Governance & clearing the DB from legacy stuff
      // */
      //   if (commonCreatedAt) {
      //     const commonCreatedAtMonthNotation =
      //       BRIEF_MONTH_NAMES[
      //         new Date(commonCreatedAt.seconds * 1000).getMonth()
      //       ];

      //     if (
      //       !chartMonthLabelsList.includes(commonCreatedAtMonthNotation) &&
      //       getMonthsDifference(
      //         new Date(commonCreatedAt.seconds * 1000),
      //         new Date(),
      //       ) <= TRANSACTIONS_PERIOD_MONTHS_AMOUNT
      //     ) {
      //       chartMonthLabelsList.unshift(commonCreatedAtMonthNotation);

      //       groupedByMonthPayInsSummaries[commonCreatedAtMonthNotation] = 0;
      //       groupedByMonthPayOutsSummaries[commonCreatedAtMonthNotation] = 0;
      //     }
      //   }

      //   const payInsChartData = chartMonthLabelsList.map(
      //     (monthLabel) => groupedByMonthPayInsSummaries[monthLabel],
      //   );
      //   const payOutsChartData = chartMonthLabelsList.map(
      //     (monthLabel) => groupedByMonthPayOutsSummaries[monthLabel],
      //   );
      //   const balanceChartData = payInsChartData.reduce(
      //     (
      //       accum: { currentBalance: number; balances: number[] },
      //       payInsMonthSum,
      //       index,
      //     ) => {
      //       let newBalance = accum.currentBalance;

      //       newBalance += payInsMonthSum;
      //       newBalance -= payOutsChartData[index];

      //       return {
      //         currentBalance: newBalance,
      //         balances: [...accum.balances, newBalance],
      //       };
      //     },
      //     {
      //       currentBalance: 0,
      //       balances: [],
      //     },
      //   ).balances;

        return {
          chartMonthLabelsList: [],
          payInsChartData: [],
          payOutsChartData: [],
          balanceChartData: [],
        };
      },
      [],
    );

    return { getCommonTransactionsChartDataSet };
  };
