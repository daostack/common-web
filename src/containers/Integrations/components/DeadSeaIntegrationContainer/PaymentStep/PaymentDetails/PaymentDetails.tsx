import React, { FC, useState } from "react";
import { ImmediateContributionPayment } from "@/containers/Common/interfaces";
import {
  Button,
  ButtonLink,
  IFrame,
  Loader,
  PaymentMethod,
} from "@/shared/components";
import { Card } from "@/shared/models";
import { formatPrice } from "@/shared/utils";
import "./index.scss";

interface PaymentDetailsProps {
  amount: number;
  cards: Card[];
  isPaymentLoading: boolean;
  intermediatePayment: ImmediateContributionPayment | null;
  onPay: () => void;
  onIframeLoaded: () => void;
  onAmountEdit: () => void;
}

const PaymentDetails: FC<PaymentDetailsProps> = (props) => {
  const {
    amount,
    cards,
    isPaymentLoading,
    intermediatePayment,
    onPay,
    onIframeLoaded,
    onAmountEdit,
  } = props;
  const [isFrameLoaded, setIsIframeLoaded] = useState(false);
  const formattedAmount = formatPrice(amount, { shouldMillify: false });
  const isLoading = isPaymentLoading || (intermediatePayment && !isFrameLoaded);

  const handleIframeLoad = () => {
    onIframeLoaded();
    setIsIframeLoaded(true);
  };

  return (
    <div className="dead-sea-payment-details">
      <div className="dead-sea-payment-details__info-block">
        <h2 className="dead-sea-payment-details__info-title">
          Dead Sea Guardians
        </h2>
        <span className="dead-sea-payment-details__info-amount">
          {formattedAmount} (ILS)
        </span>
        <span className="dead-sea-payment-details__info-hint">
          Payment details
        </span>
        <ButtonLink
          className="dead-sea-payment-details__edit-amount-button"
          onClick={!isPaymentLoading ? onAmountEdit : undefined}
        >
          Edit
        </ButtonLink>
      </div>
      {cards.length > 0 && (
        <>
          <PaymentMethod card={cards[0]} />
          <Button
            className="dead-sea-payment-details__pay-button"
            onClick={onPay}
            shouldUseFullWidth
          >
            Pay {formattedAmount} (ILS)
          </Button>
        </>
      )}
      {isLoading && <Loader />}
      {intermediatePayment && (
        <IFrame
          src={intermediatePayment.link}
          frameBorder="0"
          title="Payment Details"
          onLoad={handleIframeLoad}
        />
      )}
    </div>
  );
};

export default PaymentDetails;
