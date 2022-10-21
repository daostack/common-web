import React, { FC, useState, useEffect, ReactElement } from "react";
import classNames from "classnames";

import { getUserData } from "../../../../Auth/store/api";
import { Loader, UserAvatar } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import { useCommon } from "@/shared/hooks/useCases";
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

const TransactionsListItem: FC<TransactionsListItemProps> = (props) => {
  const {
    transaction: {
      type,
      createdAt,
      amount,
      payerId,
      parentCommonId,
      fundingRequestDescription,
    },
  } = props;
  const [payerData, setPayerData] = useState<User | null>(null);
  const {
    data: parentCommon,
    fetched: isParentCommonFetched,
    fetchCommon: fetchParentCommon,
    setCommon: setParentCommon,
  } = useCommon();

  useEffect(() => {
    (async () => {
      if (payerData || type !== TransactionType.PayIn || !payerId) return;

      try {
        const payerData = await getUserData(payerId);

        setPayerData(payerData);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [payerData, setPayerData, type, payerId]);

  useEffect(() => {
    if (isParentCommonFetched) {
      return;
    }

    if (parentCommonId) {
      fetchParentCommon(parentCommonId);
    } else {
      setParentCommon(null);
    }
  }, [
    isParentCommonFetched,
    parentCommonId,
    fetchParentCommon,
    setParentCommon,
  ]);

  const renderPayInAdditionalInfo = (): ReactElement | null => {
    const hasAdditionalInfo = Boolean(payerId || parentCommonId);

    if (!hasAdditionalInfo) {
      return fundingRequestDescription ? (
        <div className="transaction__payout-description">
          {fundingRequestDescription}
        </div>
      ) : null;
    }

    const isLoading = !isParentCommonFetched || Boolean(payerId && !payerData);

    if (isLoading) {
      return <Loader />;
    }
    if (parentCommon) {
      return (
        <div className="transaction__payin-payer-data">
          <div className="payer-name">
            Parent Common:{" "}
            <a
              href={ROUTE_PATHS.COMMON_DETAIL.replace(":id", parentCommon.id)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {parentCommon.name}
            </a>
          </div>
        </div>
      );
    }
    if (payerData) {
      return (
        <div className="transaction__payin-payer-data">
          <UserAvatar
            photoURL={payerData.photoURL}
            nameForRandomAvatar={payerData.email}
            userName={getUserName(payerData)}
            className="payer-avatar"
          />
          <div className="payer-name">{getUserName(payerData)}</div>
        </div>
      );
    }

    return null;
  };

  const renderPayOutAdditionalInfo = (): ReactElement | null => (
    <div className="transaction__payout-description">
      {fundingRequestDescription}
    </div>
  );

  const renderAdditionalInfo = (): ReactElement | null =>
    type === TransactionType.PayIn
      ? renderPayInAdditionalInfo()
      : renderPayOutAdditionalInfo();

  return (
    <div className="transaction__wrapper">
      <div className="transaction__content">
        <div className="transaction__main-info">
          <div
            className={classNames("transaction__amount", {
              "pay-in": type === TransactionType.PayIn,
              "pay-out": type === TransactionType.PayOut,
            })}
          >
            {`${type === TransactionType.PayIn ? "+ " : "- "}${formatPrice(
              amount
            )}`}
          </div>
          <div className="transaction__time">
            {formatDate(
              new Date(createdAt.seconds * 1000),
              DateFormat.LongHuman
            )}
          </div>
        </div>
        <div className="transaction__additional-info">
          {renderAdditionalInfo()}
        </div>
      </div>
    </div>
  );
};

export default TransactionsListItem;
