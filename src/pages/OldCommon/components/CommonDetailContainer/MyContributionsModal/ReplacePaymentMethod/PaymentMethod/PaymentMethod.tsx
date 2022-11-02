import React, { useEffect, FC } from "react";
import { PaymentMethod } from "@/shared/components";
import { Card } from "@/shared/models";
import "./index.scss";

interface PaymentMethodProps {
  card: Card;
  onReplacePaymentMethod: () => void;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const PaymentMethodView: FC<PaymentMethodProps> = (props) => {
  const { card, onReplacePaymentMethod, setShouldShowGoBackButton } = props;

  useEffect(() => {
    setShouldShowGoBackButton(true);
  }, [setShouldShowGoBackButton]);

  return (
    <section className="payment-method-my-contributions-step">
      <h3 className="payment-method-my-contributions-step__title">
        Payment details
      </h3>
      <div className="payment-method-my-contributions-step__card-wrapper">
        <PaymentMethod
          card={card}
          title=""
          onReplacePaymentMethod={onReplacePaymentMethod}
        />
      </div>
    </section>
  );
};

export default PaymentMethodView;
