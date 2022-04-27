import React, { useEffect, useState, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { useUserSubscriptionToCommon } from "@/shared/hooks/useCases";
import {
  isPayment,
  Common,
  Payment,
  Subscription,
  SubscriptionStatus,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { ChangeMonthlyContributionModal } from "../ChangeMonthlyContributionModal";
import "./index.scss";

const CANCELED_SUBSCRIPTION_STATUSES = [
  SubscriptionStatus.CanceledByUser,
  SubscriptionStatus.CanceledByPaymentFailure,
];

interface ActiveContributionItemProps {
  className?: string;
  contribution: Payment | Subscription;
  subscription: Subscription | null;
  common: Common;
  onSubscriptionUpdate: (subscription: Subscription) => void;
}

const ActiveItemButtons: FC<ActiveContributionItemProps> = (props) => {
  const {
    className,
    contribution,
    subscription,
    common,
    onSubscriptionUpdate,
  } = props;
  const [isChangeContributionOpen, setIsChangeContributionOpen] = useState(
    false
  );
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const latestSubscriptionState = useUserSubscriptionToCommon();
  const subscriptionIdToUse: Subscription | null =
    subscription || (!isPayment(contribution) && contribution) || null;

  const handleChangeContributionOpen = () => {
    setIsChangeContributionOpen(true);
  };
  const handleChangeContributionClose = () => {
    setIsChangeContributionOpen(false);
  };
  const handleChangeContributionFinish = (subscription: Subscription) => {
    onSubscriptionUpdate(subscription);
    handleChangeContributionClose();
  };

  useEffect(() => {
    if (
      latestSubscriptionState.loading ||
      latestSubscriptionState.fetched ||
      !subscriptionIdToUse ||
      !CANCELED_SUBSCRIPTION_STATUSES.includes(subscriptionIdToUse.status)
    ) {
      return;
    }

    latestSubscriptionState.fetch(common.id);
  }, [latestSubscriptionState, subscriptionIdToUse, common.id]);

  if (
    !subscriptionIdToUse ||
    CANCELED_SUBSCRIPTION_STATUSES.includes(subscriptionIdToUse.status)
  ) {
    return null;
  }

  return (
    <>
      <div className={classNames("billing-active-item-buttons", className)}>
        <Button
          className="billing-active-item-buttons__button"
          variant={isMobileView ? ButtonVariant.SecondaryPurple : ButtonVariant.Secondary}
          onClick={handleChangeContributionOpen}
          shouldUseFullWidth
          shadowed={!isMobileView}
        >
          Change monthly contribution
        </Button>
        <Button
          className="billing-active-item-buttons__button"
          variant={isMobileView ? ButtonVariant.SecondaryPurple : ButtonVariant.Secondary}
          shouldUseFullWidth
          shadowed={!isMobileView}
        >
          Cancel monthly payment
        </Button>
      </div>
      <ChangeMonthlyContributionModal
        isOpen={isChangeContributionOpen}
        onClose={handleChangeContributionClose}
        common={common}
        subscription={subscriptionIdToUse}
        onFinish={handleChangeContributionFinish}
      />
    </>
  );
};

export default ActiveItemButtons;
