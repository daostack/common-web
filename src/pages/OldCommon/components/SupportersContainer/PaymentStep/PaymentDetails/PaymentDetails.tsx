import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { ImmediateContributionPayment } from "@/pages/OldCommon/interfaces";
import {
  Button,
  ButtonLink,
  IFrame,
  Loader,
  PaymentMethod,
} from "@/shared/components";
import { ContributionType, ScreenSize } from "@/shared/constants";
import { Card, Currency } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice, getUserName } from "@/shared/utils";
import "./index.scss";

interface PaymentDetailsProps {
  amount: number;
  contributionType: ContributionType;
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
    contributionType,
    cards,
    isPaymentLoading,
    intermediatePayment,
    onPay,
    onIframeLoaded,
    onAmountEdit,
  } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
  const [isFrameLoaded, setIsIframeLoaded] = useState(false);
  const user = useSelector(selectUser());
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formattedAmount = formatPrice(
    { amount, currency: Currency.ILS },
    {
      shouldMillify: false,
      bySubscription: contributionType === ContributionType.Monthly,
    },
  );
  const isLoading = Boolean(
    isPaymentLoading || (intermediatePayment && !isFrameLoaded),
  );

  const handleIframeLoad = () => {
    onIframeLoaded();
    setIsIframeLoaded(true);
  };

  return (
    <div className="supporters-page-payment-details">
      {!isMobileView && (
        <>
          <h2 className="supporters-page-payment-details__title">
            {t("paymentDetails.title")}
          </h2>
          <p className="supporters-page-payment-details__description">
            {t("paymentDetails.description")}
          </p>
        </>
      )}
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
            {formattedAmount}
          </span>
          <ButtonLink
            className="supporters-page-payment-details__edit-button"
            onClick={!isPaymentLoading ? onAmountEdit : undefined}
          >
            {t("buttons.edit")}
          </ButtonLink>
        </div>
      </div>
      {isLoading && <Loader />}
      {cards.length > 0 && (
        <>
          <PaymentMethod
            card={cards[0]}
            title={t("paymentDetails.paymentMethodTitle")}
          />
          <Button
            className="supporters-page-payment-details__pay-button"
            onClick={onPay}
            disabled={isLoading}
            shouldUseFullWidth
          >
            {t("buttons.payAmount", { amount: formattedAmount })}
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
