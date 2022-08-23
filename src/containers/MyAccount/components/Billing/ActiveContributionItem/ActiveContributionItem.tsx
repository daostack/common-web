import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import {
  isPayment,
  Common,
  DateFormat,
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from "@/shared/models";
import { formatDate, formatPrice } from "@/shared/utils";
import { ActiveItemButtons } from "../ActiveItemButtons";
import "./index.scss";

interface ActiveContributionDataItem {
  title: string;
  value: string;
  status?: "success" | "failure";
}

interface ActiveContributionItemProps {
  className?: string;
  contribution: Payment | Subscription;
  subscription: Subscription | null;
  common: Common;
  onBackClick?: () => void;
  onSubscriptionUpdate: (subscription: Subscription) => void;
}

const getPaymentData = (payment: Payment): ActiveContributionDataItem[] => {
  const isFailedPayment = payment.status === PaymentStatus.Failed;

  return [
    {
      title: "Status",
      value: isFailedPayment ? "Payment failed" : "Payment succeeded",
      status: isFailedPayment ? "failure" : "success",
    },
    {
      title: "Amount",
      value: formatPrice(payment.amount.amount),
    },
  ];
};

const getSubscriptionData = (
  subscription: Subscription
): ActiveContributionDataItem[] => {
  const isCanceled = [
    SubscriptionStatus.CanceledByUser,
    SubscriptionStatus.CanceledByPaymentFailure,
  ].includes(subscription.status);
  const data: ActiveContributionDataItem[] = [
    {
      title: "Status",
      value: isCanceled ? "Canceled" : "Active",
      status: isCanceled ? "failure" : "success",
    },
  ];

  if (!isCanceled) {
    data.push({
      title: "Next payment",
      value: formatDate(
        new Date(subscription.dueDate.seconds * 1000),
        DateFormat.GeneralHuman
      ),
    });
  }

  data.push(
    {
      title: "Amount",
      value: formatPrice(subscription.amount.amount),
    },
    {
      title: "Subscribed at",
      value: formatDate(
        new Date(subscription.createdAt.seconds * 1000),
        DateFormat.GeneralHuman
      ),
    }
  );

  return data;
};

const getData = (
  contribution: Payment | Subscription,
  subscription: Subscription | null
): ActiveContributionDataItem[] => {
  if (!isPayment(contribution)) {
    return getSubscriptionData(contribution);
  }

  return subscription
    ? getSubscriptionData(subscription)
    : getPaymentData(contribution);
};

const ActiveContributionItem: FC<ActiveContributionItemProps> = (props) => {
  const {
    className,
    contribution,
    subscription,
    common,
    onBackClick,
    onSubscriptionUpdate,
  } = props;

  if (isPayment(contribution) && contribution.subscriptionId && !subscription) {
    return null;
  }

  const data = getData(contribution, subscription);

  return (
    <div className={classNames("billing-active-contribution-item", className)}>
      <header className="billing-active-contribution-item__header">
        <ButtonIcon onClick={onBackClick}>
          <LeftArrowIcon className="billing-active-contribution-item__header-icon" />
        </ButtonIcon>
        <h4 className="billing-active-contribution-item__title">
          {common?.name}
        </h4>
        <div className="billing-active-contribution-item__header-icon billing-active-contribution-item__right-icon" />
      </header>
      <ul className="billing-active-contribution-item__list">
        {data.map((item) => (
          <li
            key={item.title}
            className="billing-active-contribution-item__list-item"
          >
            <span className="billing-active-contribution-item__list-item-title">
              {item.title}
            </span>
            <span
              className={classNames(
                "billing-active-contribution-item__list-item-value",
                {
                  "billing-active-contribution-item__list-item-value--success":
                    item.status === "success",
                  "billing-active-contribution-item__list-item-value--failure":
                    item.status === "failure",
                }
              )}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
      <ActiveItemButtons
        className="billing-active-contribution-item__active-item-buttons"
        contribution={contribution}
        subscription={subscription}
        common={common}
        onSubscriptionUpdate={onSubscriptionUpdate}
      />
    </div>
  );
};

export default ActiveContributionItem;
