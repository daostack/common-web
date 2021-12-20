import React, { FC } from "react";
import "./index.scss";

interface MembershipRequestPaymentMethodProps {

}

const MembershipRequestPaymentMethod: FC<MembershipRequestPaymentMethodProps> = () => {
  const isVisaCard = false;
  const imageAlt = `${isVisaCard ? "Visa" : "Mastercard"} logo`;
  const cardHolder = "Ashley Johnson";
  const cardNumber = "********1234";
  const expiration = "01/2030";

  return (
    <div className="membership-request-payment-method">
      <h4 className="membership-request-payment-method__title">
        Payment method
      </h4>
      <div className="membership-request-payment-method__content-wrapper">
        <img
          className="membership-request-payment-method__payment-logo"
          srcSet="
            /assets/images/mastercard_logo@3x.png 3x,
            /assets/images/mastercard_logo@2x.png 2x
          "
          src="/assets/images/mastercard_logo.png"
          alt={imageAlt}
        />
        <div className="membership-request-payment-method__card-info-wrapper">
          <span className="membership-request-payment-method__card-holder">
            {cardHolder}
          </span>
          <span>{cardNumber}</span>
        </div>
        <span className="membership-request-payment-method__expiration">
          {expiration}
        </span>
      </div>
    </div>
  );
};

export default MembershipRequestPaymentMethod;
