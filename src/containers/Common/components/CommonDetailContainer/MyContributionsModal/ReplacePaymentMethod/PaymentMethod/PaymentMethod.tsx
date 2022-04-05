import React, { useEffect, FC } from "react";
import { Common } from "@/shared/models";
import "./index.scss";

interface PaymentMethodProps {
  common: Common;
  setShouldShowGoBackButton: (value: boolean) => void;
}

const PaymentMethod: FC<PaymentMethodProps> = (props) => {
  const { common, setShouldShowGoBackButton } = props;

  useEffect(() => {
    setShouldShowGoBackButton(true);
  }, [setShouldShowGoBackButton]);

  return (
    <section className="payment-method-my-contributions-step">
      <h3 className="payment-method-my-contributions-step__title">
        Payment details
      </h3>
    </section>
  );
};

export default PaymentMethod;
