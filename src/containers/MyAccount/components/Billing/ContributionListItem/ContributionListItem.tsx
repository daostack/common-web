import React, { FC } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import {
  isPayment,
  DateFormat,
  Payment,
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
  title: string;
  contribution: Payment | Subscription;
}

const getSubscriptionContent = (subscription: Subscription): Content => {
  const isCanceled = [
    SubscriptionStatus.CanceledByUser,
    SubscriptionStatus.CanceledByPaymentFailure,
  ].includes(subscription.status);

  return {
    status: isCanceled ? "failure" : "success",
    statusText: isCanceled ? "Canceled" : "Active",
    statusDescription: isCanceled
      ? ""
      : `${formatPrice(subscription.amount)}/mo`,
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

const getContent = (contribution: Payment | Subscription): Content => {
  if (!isPayment(contribution)) {
    return getSubscriptionContent(contribution);
  }

  return {
    statusText: "Payment failed",
    statusDescription: "",
  };
};

const ContributionListItem: FC<ContributionListProps> = (props) => {
  const { title, contribution } = props;
  const { status, statusText, statusDescription, description } = getContent(
    contribution
  );

  return (
    <li className="billing-contribution-list-item">
      <ButtonLink className="billing-contribution-list-item__link">
        <div className="billing-contribution-list-item__title-wrapper">
          <h3 className="billing-contribution-list-item__title">{title}</h3>
          <p className="billing-contribution-list-item__description">
            {description}
          </p>
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
