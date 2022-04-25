import React, { FC } from "react";
import classNames from "classnames";
import { isPayment, Common, Payment, Subscription } from "@/shared/models";
import { ContributionListItem } from "../ContributionListItem";
import "./index.scss";

interface ContributionListProps {
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commons: Common[];
}

const ContributionList: FC<ContributionListProps> = (props) => {
  const { contributions, subscriptions, commons } = props;

  return (
    <div
      className={classNames("billing-contribution-list", {
        "billing-contribution-list--non-empty": contributions.length > 0,
      })}
    >
      {contributions.length === 0 ? (
        <div className="billing-contribution-list__empty-hint">
          <img
            className="billing-contribution-list__empty-hint-image"
            src="/assets/images/membership-request-funds.svg"
            alt="No contributions"
          />
          <p className="billing-contribution-list__empty-hint-text">
            You don’t have any active contributions yet.
          </p>
        </div>
      ) : (
        <ul className="billing-contribution-list__list">
          {contributions.map((contribution) => {
            const commonId = isPayment(contribution)
              ? contribution.commonId
              : contribution.metadata.common.id;
            const common =
              commons.find((common) => common.id === commonId) || null;
            const subscription = isPayment(contribution)
              ? subscriptions.find(
                  (item) => item.id === contribution.subscriptionId
                )
              : null;

            return (
              <ContributionListItem
                key={contribution.id}
                title={common?.name || ""}
                contribution={contribution}
                subscription={subscription}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ContributionList;
