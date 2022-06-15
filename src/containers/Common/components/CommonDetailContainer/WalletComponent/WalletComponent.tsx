import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { ChartData } from "chart.js";

import {
  Common,
  Currency,
  TransactionType,
  TransactionData,
  ProposalType,
  ProposalState,
  ProposalFundingState,
  FundingProcessStage,
  Time,
} from "@/shared/models";
import { Loader, ChartCanvas } from "@/shared/components";
import { ChartType, ScreenSize } from "@/shared/constants";
import { sortByCreatedTime, formatPrice } from "@/shared/utils";
import { getScreenSize } from "@/shared/store/selectors";
import { fetchCommonContributions, fetchCommonProposals } from "../../../store/api";
import { TransactionsList } from "../";
import { CommonWalletChartOptions, WalletMenuItems } from "./constants";
import { useCommonTransactionsChartDataSet } from "./hooks";
import "./index.scss";

interface WalletComponentProps {
  common: Common;
}

const getTransactionsListTitle = (activeMenuItem: WalletMenuItems): string => {
  switch (activeMenuItem) {
    case WalletMenuItems.All:
      return "All Transactions";
    case WalletMenuItems.PayIn:
      return "Pay-In Transactions";
    case WalletMenuItems.PayOut:
      return "Pay-Out Transactions";
  }
};

const WalletComponent: FC<WalletComponentProps> = ({ common }) => {
  const walletMenuRef = useRef<HTMLDivElement>(null);
  const initialWalletMenuOffsetTop = walletMenuRef.current?.offsetTop || null;
  const [isWalletMenuSticked, setIsWalletMenuSticked] = useState<boolean>(false);

  const [activeMenuItem, setActiveMenuItem] = useState<WalletMenuItems>(WalletMenuItems.All);
  const [paymentsInData, setPaymentsInData] = useState<TransactionData[] | null>(null);
  const [paymentsOutData, setPaymentsOutData] = useState<TransactionData[] | null>(null);
  const [formattedChartData, setFormattedChartData] = useState<ChartData | null>(null);
  const { getCommonTransactionsChartDataSet } = useCommonTransactionsChartDataSet();

  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);

  const orderedCommonTransactions = useMemo<TransactionData[] | null>(() => {
    if (!paymentsInData || !paymentsOutData)
      return null;

    return [...paymentsInData, ...paymentsOutData].sort(sortByCreatedTime) as TransactionData[];
  }, [paymentsInData, paymentsOutData]);

  const renderTransactionsList = useCallback((activeMenuItem: WalletMenuItems) => {
    if (
      !paymentsInData
      || !paymentsOutData
      || !orderedCommonTransactions
    ) return <Loader />;

    let renderingTransactionsData: TransactionData[] = [];

    switch (activeMenuItem) {
      case WalletMenuItems.All:
        renderingTransactionsData = orderedCommonTransactions;
        break;
      case WalletMenuItems.PayIn:
        renderingTransactionsData = paymentsInData;
        break;
      case WalletMenuItems.PayOut:
        renderingTransactionsData = paymentsOutData;
        break;
    }

    return <TransactionsList transactions={renderingTransactionsData} />;
  }, [paymentsInData, paymentsOutData, orderedCommonTransactions]);

  useEffect(() => {
    (
      async () => {
        if (paymentsInData !== null)
          return;

        try {
          const commonPaymentsIn = (await fetchCommonContributions(common.id))
                                    .filter(
                                      payment =>
                                        (payment.amount.currency === Currency.ILS)
                                    );

          setPaymentsInData(
            commonPaymentsIn.map(
              payment => (
                {
                  type: TransactionType.PayIn,
                  payerId: payment.userId,
                  amount: payment.amount.amount,
                  createdAt: payment.createdAt,
                }
              )
            ).sort(sortByCreatedTime) as TransactionData[]
          );
        } catch (error) {
          console.error(error);
        }
      }
    )();
  }, [paymentsInData, setPaymentsInData, common.id]);

  useEffect(() => {
    (
      async () => {
        if (paymentsOutData !== null)
          return;

        try {
          const commonProposals = await fetchCommonProposals(common.id);

          const chargedCommonProposals = commonProposals.filter(
            proposal => (
              proposal.type === ProposalType.FundingRequest
              && proposal.state === ProposalState.PASSED
              && proposal.fundingState === ProposalFundingState.Funded
              && proposal.fundingProcessStage === FundingProcessStage.Completed
            )
          );

          setPaymentsOutData(
            chargedCommonProposals.map(
              proposal => (
                {
                  type: TransactionType.PayOut,
                  amount: proposal.fundingRequest?.amount,
                  createdAt: proposal.createdAt || proposal.createTime,
                  fundingRequestDescription: proposal.description.description,
                }
              )
            ).sort(sortByCreatedTime) as TransactionData[]
          );
        } catch (error) {
          console.error(error);
        }
      }
    )();
  }, [paymentsOutData, setPaymentsOutData, common.id]);

  useEffect(() => {
    if (!!formattedChartData || !orderedCommonTransactions)
      return;

    const {
      chartMonthLabelsList,
      balanceChartData,
      payInsChartData,
      payOutsChartData,
    } = getCommonTransactionsChartDataSet(orderedCommonTransactions, common?.createdAt as Time);

    setFormattedChartData(
      {
        labels: chartMonthLabelsList,
        datasets: [
          {
            label: "Balance",
            data: balanceChartData,
            fill: false,
            borderColor: "rgb(210, 216, 255)",
            backgroundColor: "rgb(210, 216, 255)",
            tension: 0.1,
          },
          {
            label: "Pay-In",
            data: payInsChartData,
            fill: false,
            borderColor: "rgb(113, 126, 247)",
            backgroundColor: "rgb(113, 126, 247)",
            tension: 0.1,
          },
          {
            label: "Pay-Out",
            data: payOutsChartData,
            fill: false,
            borderColor: "rgb(1, 77, 139)",
            backgroundColor: "rgb(1, 77, 139)",
            tension: 0.1,
          }
        ],
      }
    );
  }, [
      formattedChartData,
      orderedCommonTransactions,
      common.createdAt,
      getCommonTransactionsChartDataSet,
    ]
  );

  useEffect(() => {
    if (!isMobileView || !initialWalletMenuOffsetTop)
      return;

    setIsWalletMenuSticked(window.pageYOffset >= (initialWalletMenuOffsetTop + 680));
    // eslint-disable-next-line
  }, [isMobileView, initialWalletMenuOffsetTop, window.pageYOffset]);

  return (
    <div className="wallet__component-wrapper">
      <div className="wallet__component-header-wrapper">
        <div className="wallet__common-title-wrapper">
          <div className="wallet__common-title">
            Common Wallet
          </div>
          {
            isMobileView
            && <div className="wallet__common-name">
              {common.name || ""}
            </div>
          }
        </div>
        <div className="wallet__common-balance-chart-wrapper wallet__section-element">
          <div className="wallet__common-balance-chart">
            <div className="balance">
              <div className="current">
                <div className="current-balance-title">
                  Current Balance
                </div>
                <div className="current-balance-amount">
                  {formatPrice(common.balance, { shouldRemovePrefixFromZero: false })}
                </div>
              </div>
              <div className="pending">
                <div className="pending-balance-title">
                  Pending soon
                </div>
                <div className="pending-balance-amount">
                  <div>
                    {formatPrice(common.reservedBalance, { shouldRemovePrefixFromZero: false })}
                  </div>
                  <img src="/icons/common-icons/pending-balance.svg" alt="pending balance" />
                </div>
              </div>
            </div>
            {
              !isMobileView
              && <div className="common-transactions-chart-wrapper">
                {
                  formattedChartData
                    ? <ChartCanvas
                        type={ChartType.Line}
                        data={formattedChartData}
                        options={CommonWalletChartOptions}
                      />
                  : <Loader />
                }
              </div>
            }
          </div>
        </div>
      </div>
      <div
        ref={walletMenuRef}
        className={
          classNames(
            "wallet__menu-wrapper",
            "wallet__section-element",
            {
              sticked: isWalletMenuSticked,
            }
          )
        } 
      >
        <ul className="wallet__menu">
          <li
            onClick={() => setActiveMenuItem(WalletMenuItems.All)}
            className={classNames({ active: activeMenuItem === WalletMenuItems.All })}
          >
            {WalletMenuItems.All}
          </li>
          <li
            onClick={() => setActiveMenuItem(WalletMenuItems.PayIn)}
            className={classNames({ active: activeMenuItem === WalletMenuItems.PayIn })}
          >
            {WalletMenuItems.PayIn}
          </li>
          <li
            onClick={() => setActiveMenuItem(WalletMenuItems.PayOut)}
            className={classNames({ active: activeMenuItem === WalletMenuItems.PayOut })}
          >
            {WalletMenuItems.PayOut}
          </li>
        </ul>
      </div>
      <div className="wallet__transactions-title-wrapper">
        <div className="wallet__transactions-title">
          {
            getTransactionsListTitle(activeMenuItem)
          }
        </div>
      </div>
      <div className="wallet__transactions-wrapper">
        {
          renderTransactionsList(activeMenuItem)
        }
      </div>
    </div>
  );
};

export default WalletComponent;
