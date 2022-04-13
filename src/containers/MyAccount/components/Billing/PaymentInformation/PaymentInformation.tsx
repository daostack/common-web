import React, { FC } from "react";
import { useSelector } from "react-redux";
import { Modal, PaymentMethod } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ChangePaymentMethodState } from "@/shared/hooks/useCases";
import { Card } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { AddingCard } from "../AddingCard";
import { ChangePaymentMethod } from "../ChangePaymentMethod";
import { PaymentMethodUpdateSuccess } from "../PaymentMethodUpdateSuccess";
import "./index.scss";

interface PaymentInformationProps {
  cards: Card[];
  changePaymentMethodState: ChangePaymentMethodState;
  onPaymentMethodChange: () => void;
  onChangePaymentMethodStateClear: () => void;
}

const PaymentInformation: FC<PaymentInformationProps> = (props) => {
  const {
    cards,
    changePaymentMethodState,
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
        <PaymentMethod
          className="billing-payment-information__payment-method"
          card={cards[0]}
          title=""
          onReplacePaymentMethod={onPaymentMethodChange}
        />
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
              <PaymentMethodUpdateSuccess onFinish={onChangePaymentMethodStateClear} />
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
