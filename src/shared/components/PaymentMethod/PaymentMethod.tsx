import React, { ReactElement } from "react";
import { ButtonLink, } from "@/shared/components";
import { Card } from "../../models";
import "./index.scss";

interface PaymentMethodProps {
  card: Card;
  onReplacePaymentMethod: () => void;
}

const PaymentMethod = (props: PaymentMethodProps): ReactElement => {
  const {
    card: {
        fullName: cardHolder,
        metadata: {
            expiration: expirationDate,
            digits: lastCardNumberDigits,
            network: cardBrand,
        },
    },
    onReplacePaymentMethod,
  } = props;
  const imageAlt = `${cardBrand} logo`;

  return (
    <div className="payment-method">
      <h4 className="payment-method__title">
        Payment method
      </h4>

        <div className="payment-method__content-wrapper">
          <div className="payment-method__card-wrapper">
            {
              /*
                FIXME: need to add a multiple card brand icons (into the assets)
                and its conditional src choosing correspondingly
              */
            }
            <img
              className="payment-method__payment-logo"
              srcSet="
                /assets/images/mastercard_logo@3x.png 3x,
                /assets/images/mastercard_logo@2x.png 2x
              "
              src="/assets/images/mastercard_logo.png"
              alt={imageAlt}
            />

            <div className="payment-method__card-info-wrapper">
                <span className="payment-method__card-holder">
                  {cardHolder}
                </span>

                <span>{`**** **** **** ${lastCardNumberDigits}`}</span>
            </div>

            <span className="payment-method__expiration">
              {
                expirationDate
                ? `${expirationDate.slice(0, 2)}/${expirationDate.slice(2)}`
                : ""
              }
            </span>
          </div>

          <div className="payment-method__replace-wrapper">
            <ButtonLink
              className="payment-method__replace"
              onClick={onReplacePaymentMethod}
            >
              Replace payment method?
            </ButtonLink>
          </div>
        </div>
    </div>
  );
};

export default PaymentMethod;
