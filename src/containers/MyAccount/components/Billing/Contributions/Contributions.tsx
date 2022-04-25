import React, { FC } from "react";
import { useSelector } from "react-redux";
import { ScreenSize } from "@/shared/constants";
import { Common, isPayment, Payment, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ActiveContributionItem } from "../ActiveContributionItem";
import { ContributionList } from "../ContributionList";
import "./index.scss";

interface ContributionsProps {
  activeContribution?: Payment | Subscription | null;
  contributions: (Payment | Subscription)[];
  subscriptions: Subscription[];
  commons: Common[];
  onActiveContributionSelect: (
    contribution: Payment | Subscription | null
  ) => void;
}

const Contributions: FC<ContributionsProps> = (props) => {
  const {
    activeContribution,
    contributions,
    subscriptions,
    commons,
    onActiveContributionSelect,
  } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const commonId =
    activeContribution &&
    (isPayment(activeContribution)
      ? activeContribution.commonId
      : activeContribution.metadata.common.id);
  const common = commons.find((common) => common.id === commonId) || null;

  const subscription =
    (activeContribution &&
      isPayment(activeContribution) &&
      subscriptions.find(
        (item) => item.id === activeContribution.subscriptionId
      )) ||
    null;

  const handleBackClick = () => {
    onActiveContributionSelect(null);
  };

  return (
    <>
      {!activeContribution && (
        <ContributionList
          contributions={contributions}
          subscriptions={subscriptions}
          commons={commons}
          onClick={onActiveContributionSelect}
        />
      )}
      {activeContribution && !isMobileView && common && (
        <ActiveContributionItem
          contribution={activeContribution}
          subscription={subscription}
          common={common}
          onBackClick={handleBackClick}
        />
      )}
    </>
  );
};

export default Contributions;
