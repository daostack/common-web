import React, { useRef, FC } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import {
  isPayment,
  DateFormat,
  Payment,
  PaymentStatus,
  Subscription,
  SubscriptionStatus,
} from "@/shared/models";
import { formatDate, formatPrice } from "@/shared/utils";
import "./index.scss";

interface Content {
  status?: "success" | "failure";
  statusText: string;
  statusDescription?: string;
  description?: string;
}

interface ContributionListProps {
  id: string;
  title: string;
  contribution: Payment | Subscription;
  subscription?: Subscription | null;
  onClick?: (elementTopOffset?: number) => void;
}

const checkCanceledSubscription = (subscription: Subscription): boolean =>
  [
    SubscriptionStatus.CanceledByUser,
    SubscriptionStatus.CanceledByPaymentFailure,
  ].includes(subscription.status);

const getSubscriptionContent = (subscription: Subscription): Content => {
  const isCanceled = checkCanceledSubscription(subscription);

  return {
    status: isCanceled ? "failure" : "success",
    statusText: isCanceled ? "Canceled" : "Active",
    statusDescription: isCanceled
      ? subscription.canceledAt
        ? `${formatDate(
            new Date(subscription.canceledAt.seconds * 1000),
            DateFormat.GeneralHuman
          )}`
        : ""
      : `${formatPrice(subscription.amount.amount)}/mo`,
    description: isCanceled
      ? `Canceled by ${
          subscription.status === SubscriptionStatus.CanceledByUser
            ? "user"
            : "payment failure"
        }`
      : `Next payment: ${formatDate(
          new Date(subscription.dueDate.seconds * 1000),
          DateFormat.GeneralHuman
        )}`,
  };
};

const getPaymentContent = (
  payment: Payment,
  subscription?: Subscription | null
): Content => {
  const isFailedPayment = payment.status === PaymentStatus.Failed;
  const isMonthlyPayment = Boolean(payment.subscriptionId);

  return {
    status: isFailedPayment ? "failure" : "success",
    statusText: isFailedPayment ? "Payment failed" : "Payment succeeded",
    statusDescription: `${formatPrice(
      subscription?.amount.amount ?? payment.amount.amount
    )}${isMonthlyPayment ? "/mo" : ""}`,
    description:
      isMonthlyPayment &&
      subscription &&
      !checkCanceledSubscription(subscription)
        ? `Next payment: ${formatDate(
            new Date(subscription.dueDate.seconds * 1000),
            DateFormat.GeneralHuman
          )}`
        : "",
  };
};

const getContent = (
  contribution: Payment | Subscription,
  subscription?: Subscription | null
): Content =>
  isPayment(contribution)
    ? getPaymentContent(contribution, subscription)
    : getSubscriptionContent(contribution);

const ContributionListItem: FC<ContributionListProps> = (props) => {
  const { id, title, contribution, subscription, onClick } = props;
  const itemRef = useRef<HTMLLIElement>(null);
  const { status, statusText, statusDescription, description } = getContent(
    contribution,
    subscription
  );

  const handleClick = () => {
    if (onClick) {
      onClick(itemRef.current?.offsetTop);
    }
  };

  return (
    <li ref={itemRef} id={id} className="billing-contribution-list-item">
      <ButtonLink
        className="billing-contribution-list-item__link"
        onClick={handleClick}
      >
        <div
          className={classNames(
            "billing-contribution-list-item__title-wrapper",
            {
              "billing-contribution-list-item__title-wrapper--centered": !description,
            }
          )}
        >
          <h3 className="billing-contribution-list-item__title">{title}</h3>
          {description && (
            <p className="billing-contribution-list-item__description">
              {description}
            </p>
          )}
        </div>
        <div className="billing-contribution-list-item__status-container">
          <div
            className={classNames(
              "billing-contribution-list-item__status-wrapper",
              {
                "billing-contribution-list-item__status-wrapper--centered": !statusDescription,
              }
            )}
          >
            <span
              className={classNames("billing-contribution-list-item__status", {
                "billing-contribution-list-item__status--failed":
                  status === "failure",
              })}
            >
              {statusText}
            </span>
            {statusDescription && <span>{statusDescription}</span>}
          </div>
          <RightArrowIcon className="billing-contribution-list-item__right-arrow-icon" />
        </div>
      </ButtonLink>
    </li>
  );
};

export default ContributionListItem;
