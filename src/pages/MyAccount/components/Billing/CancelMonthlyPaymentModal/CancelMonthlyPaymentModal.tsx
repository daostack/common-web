import React, { useState, FC } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { cancelSubscription } from "@/pages/OldCommon/store/actions";
import { Button, ButtonVariant, Loader, Modal } from "@/shared/components";
import { DAYS_TILL_REMOVAL_FROM_COMMON_AFTER_CANCELING } from "@/shared/constants";
import { ModalType } from "@/shared/interfaces";
import { Common, DateFormat, Subscription } from "@/shared/models";
import "./index.scss";

interface ChangeMonthlyContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  common: Common;
  subscription: Subscription;
  onFinish: (subscription: Subscription) => void;
}

const CancelMonthlyPaymentModal: FC<ChangeMonthlyContributionModalProps> = (
  props,
) => {
  const { isOpen, onClose, common, subscription, onFinish } = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscriptionCancel = () => {
    setIsLoading(true);

    dispatch(
      cancelSubscription.request({
        payload: subscription.id,
        callback: (error, subscription) => {
          if (subscription) {
            onFinish(subscription);
          }

          setIsLoading(false);
        },
      }),
    );
  };

  return (
    <Modal
      isShowing={isOpen}
      onClose={onClose}
      type={ModalType.MobilePopUp}
      closePrompt={isLoading}
    >
      <div className="billing-cancel-monthly-payment-modal__content">
        {isLoading && (
          <div>
            <Loader />
          </div>
        )}
        {!isLoading && (
          <>
            <img
              className="billing-cancel-monthly-payment-modal__image"
              src="/assets/images/illustration-broken-card.svg"
              alt="Monthly payment canceling"
            />
            <h3 className="billing-cancel-monthly-payment-modal__title">
              Cancel payment
            </h3>
            <p className="billing-cancel-monthly-payment-modal__hint">
              If you cancel, you will leave <strong>{common.name}</strong> in{" "}
              {DAYS_TILL_REMOVAL_FROM_COMMON_AFTER_CANCELING} days (
              {moment()
                .add(DAYS_TILL_REMOVAL_FROM_COMMON_AFTER_CANCELING, "days")
                .format(DateFormat.ShortWithDots)}
              )
            </p>
            <div className="billing-cancel-monthly-payment-modal__buttons-wrapper">
              <Button
                className="billing-cancel-monthly-payment-modal__button"
                variant={ButtonVariant.Secondary}
                onClick={onClose}
                shouldUseFullWidth
              >
                Stay a member
              </Button>
              <Button
                className="billing-cancel-monthly-payment-modal__button billing-cancel-monthly-payment-modal__button--red"
                variant={ButtonVariant.Secondary}
                onClick={handleSubscriptionCancel}
                shouldUseFullWidth
              >
                Cancel anyway
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CancelMonthlyPaymentModal;
