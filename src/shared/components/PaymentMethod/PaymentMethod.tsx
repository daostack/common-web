import React, {
  useState, 
  useCallback,
  ReactElement,
} from "react";
import { useSelector } from "react-redux";
import { Button, ButtonLink, } from "@/shared/components";
import { ModalFooter } from "@/shared/components/Modal";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";
import { Card } from "../../models";
import "./index.scss";

interface PaymentMethodProps {
  card: Card;
  onContinuePayment: () => void;
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
    onContinuePayment,
    onReplacePaymentMethod,
  } = props;

  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const imageAlt = `${cardBrand} logo`;

  return (
    <div className="payment-method">
      <h4 className="payment-method__title">
        Payment method
      </h4>
        <div className="payment-method__content-wrapper">
          <div className="payment-method__card-wrapper">
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

                <span>{`************${lastCardNumberDigits}`}</span>
            </div>

            <span className="payment-method__expiration">
              {expirationDate}
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

        <ModalFooter sticky>
          <div className="payment-method__continue-button-wrapper">
            <Button
              key="payment-method-continue"
              className="payment-method__continue-button"
              shouldUseFullWidth={isMobileView}
              onClick={onContinuePayment}
            >
              Continue to payment
            </Button>
          </div>
        </ModalFooter>
    </div>
  );
};

export default PaymentMethod;
