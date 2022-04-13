import React, { FC } from "react";
import { Button, ButtonVariant } from "@/shared/components";
import "./index.scss";

interface PaymentMethodUpdateSuccessProps {
  onFinish: () => void;
}

const PaymentMethodUpdateSuccess: FC<PaymentMethodUpdateSuccessProps> = ({
  onFinish,
}) => {
  return (
    <div className="billing-payment-method-update-success">
      <img
        className="billing-payment-method-update-success__image"
        src="/assets/images/add-payment-method.svg"
        alt="Payment method"
      />
      <h3 className="billing-payment-method-update-success__title">
        Payment method updated
      </h3>
      <Button
        className="billing-payment-method-update-success__button"
        variant={ButtonVariant.Secondary}
        onClick={onFinish}
        shouldUseFullWidth
      >
        OK
      </Button>
    </div>
  );
};

export default PaymentMethodUpdateSuccess;
