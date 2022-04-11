import React, { FC } from "react";
import { PaymentMethod } from "@/shared/components";
import { Card } from "@/shared/models";
import { AddingCard } from "../AddingCard";
import "./index.scss";

interface PaymentInformationProps {
  cards: Card[];
}

const PaymentInformation: FC<PaymentInformationProps> = (props) => {
  const { cards } = props;

  const handlePaymentMethodAdd = () => {};

  const handleReplacePaymentMethod = () => {};

  return cards.length === 0 ? (
    <AddingCard
      text="Add your payment information. And start joining Common communities."
      imageSrc="/assets/images/add-payment-method.svg"
      imageAlt="Add payment method"
      buttonText="Add Billing Details"
      onClick={handlePaymentMethodAdd}
    />
  ) : (
    <PaymentMethod
      className="billing-payment-information__payment-method"
      card={cards[0]}
      title=""
      onReplacePaymentMethod={handleReplacePaymentMethod}
    />
  );
};

export default PaymentInformation;
