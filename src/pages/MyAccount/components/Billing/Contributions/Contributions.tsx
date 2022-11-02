import React, { useRef, FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { Common, isPayment, Payment, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ActiveContributionItem } from "../ActiveContributionItem";
import { ContributionList, ContributionListRef } from "../ContributionList";
import "./index.scss";

const CONTRIBUTION_LIST_ID = "contribution-list";

interface ContributionsProps {
  activeContribution?: Payment | Subscription | null;
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commons: Common[];
  onActiveContributionSelect: (
    contribution: Payment | Subscription | null,
    elementTopOffset?: number,
  ) => void;
  onActiveSubscriptionUpdate?: (subscription: Subscription) => void;
}

const Contributions: FC<ContributionsProps> = (props) => {
  const {
    activeContribution,
    contributions,
    subscriptions,
    commons,
    onActiveContributionSelect,
    onActiveSubscriptionUpdate,
  } = props;
  const contributionListRef = useRef<ContributionListRef>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonId = activeContribution && activeContribution.commonId;
  const common = commons.find((common) => common.id === commonId) || null;

  const subscription =
    (activeContribution &&
      isPayment(activeContribution) &&
      subscriptions.find(
        (item) => item.id === activeContribution.subscriptionId,
      )) ||
    null;

  const handleBackClick = () => {
    setTimeout(() => {
      if (!activeContribution) {
        return;
      }

      const itemId = activeContribution.id;
      onActiveContributionSelect(null);
      contributionListRef.current?.scrollTo(itemId);
    }, 0);
  };

  return (
    <>
      {!activeContribution && (
        <ContributionList
          ref={contributionListRef}
          listId={CONTRIBUTION_LIST_ID}
          contributions={contributions}
          subscriptions={subscriptions}
          commons={commons}
          onClick={onActiveContributionSelect}
        />
      )}
      {activeContribution &&
        !isMobileView &&
        common &&
        onActiveSubscriptionUpdate && (
          <ActiveContributionItem
            contribution={activeContribution}
            subscription={subscription}
            common={common}
            onBackClick={handleBackClick}
            onSubscriptionUpdate={onActiveSubscriptionUpdate}
          />
        )}
    </>
  );
};

export default Contributions;
