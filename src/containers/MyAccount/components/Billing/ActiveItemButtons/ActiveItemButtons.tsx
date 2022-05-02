import React, { useState, FC } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { Button, ButtonVariant } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import {
  isPayment,
  Common,
  Payment,
  Subscription,
  SubscriptionStatus,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { CancelMonthlyPaymentModal } from "../CancelMonthlyPaymentModal";
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
  const [isPaymentCancelingOpen, setIsPaymentCancelingOpen] = useState(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
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

  const handlePaymentCancelingOpen = () => {
    setIsPaymentCancelingOpen(true);
  };
  const handlePaymentCancelingClose = () => {
    setIsPaymentCancelingOpen(false);
  };
  const handlePaymentCancelingFinish = (subscription: Subscription) => {
    onSubscriptionUpdate(subscription);
    handlePaymentCancelingClose();
  };

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
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
          onClick={handleChangeContributionOpen}
          shouldUseFullWidth
          shadowed={!isMobileView}
        >
          Change monthly contribution
        </Button>
        <Button
          className="billing-active-item-buttons__button"
          variant={
            isMobileView
              ? ButtonVariant.SecondaryPurple
              : ButtonVariant.Secondary
          }
          onClick={handlePaymentCancelingOpen}
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
      <CancelMonthlyPaymentModal
        isOpen={isPaymentCancelingOpen}
        onClose={handlePaymentCancelingClose}
        common={common}
        subscription={subscriptionIdToUse}
        onFinish={handlePaymentCancelingFinish}
      />
    </>
  );
};

export default ActiveItemButtons;
