import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Modal, PaymentMethod } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import QuestionOutlineIcon from "@/shared/icons/questionOutline.icon";
import { Card } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { ChangePaymentMethod } from "../ChangePaymentMethod";
import { PaymentMethodUpdateSuccess } from "../PaymentMethodUpdateSuccess";
import "./index.scss";

interface PaymentInformationProps {
  cards: Card[];
  changePaymentMethodState: ChangePaymentMethodState;
  errorText?: string;
  onPaymentMethodChange: () => void;
  onChangePaymentMethodStateClear: () => void;
}

const PaymentInformation: FC<PaymentInformationProps> = (props) => {
  const {
    cards,
    changePaymentMethodState,
    errorText,
    onPaymentMethodChange,
    onChangePaymentMethodStateClear,
  } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  return (
    <>
      {cards.length === 0 ? (
        <AddingCard
          text="Add your payment information. And start joining Common communities."
          imageSrc="/assets/images/add-payment-method.svg"
          imageAlt="Add payment method"
          buttonText="Add Billing Details"
          onClick={onPaymentMethodChange}
        />
      ) : (
        <div className="billing-payment-information__payment-method-card">
          {errorText && (
            <span className="billing-payment-information__alert">
              <QuestionOutlineIcon className="billing-payment-information__alert-icon" />
              {errorText}
            </span>
          )}
          <div className="billing-payment-information__payment-method-wrapper">
            <PaymentMethod
              card={cards[0]}
              title=""
              onReplacePaymentMethod={onPaymentMethodChange}
            />
          </div>
        </div>
      )}
      {!isMobileView &&
        (changePaymentMethodState.isPaymentLoading ||
          changePaymentMethodState.payment ||
          changePaymentMethodState.createdCard) && (
          <Modal
            isShowing
            onClose={onChangePaymentMethodStateClear}
            title={changePaymentMethodState.createdCard ? "" : "Payment method"}
            closePrompt={!changePaymentMethodState.createdCard}
          >
            {changePaymentMethodState.createdCard ? (
              <PaymentMethodUpdateSuccess
                onFinish={onChangePaymentMethodStateClear}
              />
            ) : (
              <div className="billing-payment-information__modal-content">
                <ChangePaymentMethod data={changePaymentMethodState} />
              </div>
            )}
          </Modal>
        )}
    </>
  );
};

export default PaymentInformation;
