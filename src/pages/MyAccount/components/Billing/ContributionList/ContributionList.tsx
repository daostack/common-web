import React, {
  forwardRef,
  useImperativeHandle,
  ForwardRefRenderFunction,
} from "react";
import { scroller } from "react-scroll";
import classNames from "classnames";
import { isPayment, Common, Payment, Subscription } from "@/shared/models";
import { ContributionListItem } from "../ContributionListItem";
import { getContributionListItemId } from "./helpers";
import "./index.scss";

export interface ContributionListRef {
  scrollTo: (itemId: string) => void;
}

interface ContributionListProps {
  listId: string;
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commons: Common[];
  onClick?: (
    contribution: Payment | Subscription,
    elementTopOffset?: number,
  ) => void;
}

const ContributionList: ForwardRefRenderFunction<
  ContributionListRef,
  ContributionListProps
> = (props, contributionListRef) => {
  const { listId, contributions, subscriptions, commons, onClick } = props;

  useImperativeHandle(
    contributionListRef,
    () => ({
      scrollTo: (itemId: string) => {
        scroller.scrollTo(getContributionListItemId(itemId), {
          containerId: listId,
          delay: 0,
          duration: 200,
          horizontal: false,
          offset: -170,
          smooth: true,
        });
      },
    }),
    [listId],
  );

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
        <ul id={listId} className="billing-contribution-list__list">
          {contributions.map((contribution) => {
            const commonId = contribution.commonId;
            const common =
              commons.find((common) => common.id === commonId) || null;
            const subscription = isPayment(contribution)
              ? subscriptions.find(
                  (item) => item.id === contribution.subscriptionId,
                )
              : null;

            return (
              <ContributionListItem
                key={contribution.id}
                id={getContributionListItemId(contribution.id)}
                title={common?.name || ""}
                contribution={contribution}
                subscription={subscription}
                onClick={(elementTopOffset) =>
                  onClick && onClick(contribution, elementTopOffset)
                }
              />
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default forwardRef(ContributionList);
