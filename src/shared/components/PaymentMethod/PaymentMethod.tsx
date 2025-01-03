import React, { ReactElement } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import { Card, CARD_BRANDS } from "../../models";
import "./index.scss";

interface Styles {
  contentWrapper?: string;
}

interface PaymentMethodProps {
  className?: string;
  card: Card;
  title?: string;
  onReplacePaymentMethod?: () => void;
  styles?: Styles;
}

const PaymentMethod = (props: PaymentMethodProps): ReactElement => {
  const {
    className,
    card: {
      fullName: cardHolder,
      metadata: {
        expiration: expirationDate,
        digits: lastCardNumberDigits,
        network: cardBrand,
      },
    },
    title = "Payment method",
    onReplacePaymentMethod,
    styles,
  } = props;
  const imageAlt = `${cardBrand} logo`;
  let imageSrc = "/assets/images/";

  switch (cardBrand) {
    case CARD_BRANDS.VISA:
      imageSrc += "visa_logo.png";
      break;
    case CARD_BRANDS.MASTERCARD:
      imageSrc += "mastercard_logo.png";
      break;
    case CARD_BRANDS.AMERICAN_EXPRESS:
      imageSrc += "americanexpress_logo.png";
      break;
    case CARD_BRANDS.DINERS_CLUB:
      imageSrc += "dinersclub_logo.png";
      break;
    case CARD_BRANDS.PAYPAL:
      imageSrc += "paypal_logо.png";
      break;
  }

  return (
    <div className={classNames("payment-method", className)}>
      {title && <h4 className="payment-method__title">{title}</h4>}

      <div
        className={classNames(
          "payment-method__content-wrapper",
          styles?.contentWrapper
        )}
      >
        <div className="payment-method__card-wrapper">
          <img
            className="payment-method__payment-logo"
            src={imageSrc}
            alt={imageAlt}
          />

          <div className="payment-method__card-info-wrapper">
            <span className="payment-method__card-holder">{cardHolder}</span>

            <span>{`**** **** **** ${lastCardNumberDigits}`}</span>
          </div>

          <span className="payment-method__expiration">
            {expirationDate
              ? `${expirationDate.slice(0, 2)}/${expirationDate.slice(2)}`
              : ""}
          </span>
        </div>

        {onReplacePaymentMethod && (
          <div className="payment-method__replace-wrapper">
            <ButtonLink
              className="payment-method__replace"
              onClick={onReplacePaymentMethod}
            >
              Replace payment method?
            </ButtonLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
