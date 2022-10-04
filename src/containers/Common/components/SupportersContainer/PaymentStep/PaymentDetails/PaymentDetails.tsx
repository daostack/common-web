import React, { FC, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { ImmediateContributionPayment } from "@/containers/Common/interfaces";
import {
  Button,
  ButtonLink,
  IFrame,
  Loader,
  PaymentMethod,
} from "@/shared/components";
import { Card } from "@/shared/models";
import { formatPrice, getUserName } from "@/shared/utils";
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
  const user = useSelector(selectUser());
  const formattedAmount = formatPrice(amount, { shouldMillify: false });
  const isLoading = Boolean(
    isPaymentLoading || (intermediatePayment && !isFrameLoaded)
  );

  const handleIframeLoad = () => {
    onIframeLoaded();
    setIsIframeLoaded(true);
  };

  return (
    <div className="supporters-page-payment-details">
      <h2 className="supporters-page-payment-details__title">
        Payment details
      </h2>
      <p className="supporters-page-payment-details__description">
        Update your payment details below
      </p>
      <div className="supporters-page-payment-details__info-block">
        <div className="supporters-page-payment-details__info-block-half">
          <span className="supporters-page-payment-details__info-title">
            {getUserName(user)}
          </span>
          <span className="supporters-page-payment-details__info-hint">
            {user?.email}
          </span>
        </div>
        <div className="supporters-page-payment-details__info-block-half">
          <span className="supporters-page-payment-details__info-amount">
            {formattedAmount} (ILS)
          </span>
          <ButtonLink
            className="supporters-page-payment-details__edit-amount-button"
            onClick={!isPaymentLoading ? onAmountEdit : undefined}
          >
            Edit
          </ButtonLink>
        </div>
      </div>
      {isLoading && <Loader />}
      {cards.length > 0 && (
        <>
          <PaymentMethod card={cards[0]} />
          <Button
            className="supporters-page-payment-details__pay-button"
            onClick={onPay}
            disabled={isLoading}
            shouldUseFullWidth
          >
            Pay {formattedAmount} (ILS)
          </Button>
        </>
      )}
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
