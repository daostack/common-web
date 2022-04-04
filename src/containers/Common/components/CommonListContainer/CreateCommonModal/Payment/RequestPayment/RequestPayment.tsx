import React, {
  useCallback,
  useEffect,
  useState,
  ReactElement,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  Loader,
  ModalHeaderContent,
  Separator,
  IFrame,
  PaymentMethod,
} from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import {
  Common,
  CommonContributionType,
  PaymentStatus,
  Card,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import {
  PaymentPayload,
  ImmediateContributionPayment,
} from "../../../../../interfaces";
import {
  getCommonsList,
  makeImmediateContribution,
  loadUserCards,
} from "../../../../../store/actions";
import { subscribeToPayment } from "../../../../../store/api";
import { Progress } from "../Progress";
import "./index.scss";

interface State {
  payment: ImmediateContributionPayment | null;
  isPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  payment: null,
  isPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

interface RequestPaymentProps {
  currentStep: number;
  onFinish: () => void;
  onError: (errorText: string) => void;
  setShouldShowGoBackButton: (value: boolean) => void;
  paymentData: PaymentPayload;
  common: Common;
}

export default function RequestPayment(
  props: RequestPaymentProps
): ReactElement {
  const {
    common,
    currentStep,
    paymentData,
    onFinish,
    onError,
    setShouldShowGoBackButton,
  } = props;
  const {
    id: commonId,
    metadata: { contributionType },
    active: isCommonActive,
  } = common;
  const dispatch = useDispatch();
  const [
    { payment, isPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const [cards, setUserCards] = useState<Card[]>([]);
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const selectedAmount = paymentData.contributionAmount;
  const contributionTypeText = (contributionType === CommonContributionType.Monthly)
                                ? "monthly"
                                : "one-time";

  const finishPayment = useCallback(() => {
    onFinish();

    if (!isCommonActive) {
      dispatch(getCommonsList.request());
    }
  }, [isCommonActive, onFinish, dispatch]);

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  const handleContinuePayment = useCallback(() => {
    if (
      !hasPaymentMethod
      || !paymentData.contributionAmount
    ) return;

    dispatch(
      makeImmediateContribution.request({
        payload: {
          commonId,
          contributionType,
          amount: paymentData.contributionAmount,
          saveCard: true,
        },
        callback: (error, payment) => {
          if (error || !payment) {
            onError(error?.message || "Something went wrong");
            return;
          }

          finishPayment();
          return;
        },
      })
    );
  }, [
    hasPaymentMethod,
    paymentData.contributionAmount,
    commonId,
    contributionType,
    finishPayment,
    onError,
    onFinish,
    dispatch,
  ]);

  useEffect(() => {
    dispatch(loadUserCards.request({
      callback: (error, cards) => {
        if (error || !cards) {
          onError(error?.message || "Something went wrong");
          return;
        }

        setUserCards(cards);
        setHasPaymentMethod(!!cards && !!cards.length);
      }
    }));
  }, [dispatch, onError]);

  useEffect(() => {
    (async () => {
      if (
        hasPaymentMethod
        || payment
        || isPaymentLoading
        || !paymentData.contributionAmount
      ) return;

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        makeImmediateContribution.request({
          payload: {
            commonId,
            contributionType,
            amount: paymentData.contributionAmount,
            saveCard: true,
          },
          callback: (error, payment) => {
            if (error || !payment) {
              onError(error?.message || "Something went wrong");
              return;
            }

            setShouldShowGoBackButton(true);
            setState((nextState) => ({
              ...nextState,
              payment: payment as ImmediateContributionPayment,
              isPaymentLoading: false,
            }));
          },
        })
      );
    })();
  }, [
    dispatch,
    hasPaymentMethod,
    commonId,
    contributionType,
    finishPayment,
    payment,
    isPaymentLoading,
    paymentData.contributionAmount,
    onFinish,
    onError,
    setShouldShowGoBackButton,
  ]);

  useEffect(() => {
    if (!isPaymentIframeLoaded || !payment)
      return;

    try {
      return subscribeToPayment(payment.paymentId, (payment) => {
        if (payment?.status === PaymentStatus.Confirmed) {
          finishPayment();
        } else if (payment?.status === PaymentStatus.Failed) {
          onError("Payment failed");
        }
      });
    } catch (error) {
      console.error("Error during subscribing to payment status change");
    }
  }, [
    isPaymentIframeLoaded,
    payment,
    finishPayment,
    onFinish,
    onError,
  ]);

  const progressEl = <Progress paymentStep={currentStep} />;

  return (
    <div className="create-common-payment">
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}

      {isMobileView && progressEl}

      <h4 className="create-common-payment__sub-title">Payment Details</h4>

      <p className="create-common-payment__sub-text">
        You are contributing{" "}
        <strong className="create-common-payment__amount">
          {formatPrice(selectedAmount, { shouldMillify: false })} (
          {contributionTypeText})
        </strong>{" "}
        to this Common.
      </p>

      <Separator className="create-common-payment__separator" />

      <div className="create-common-payment__content">
        {
          (!isPaymentIframeLoaded && !hasPaymentMethod)
          && <Loader className="create-common-payment__loader" />
        }
        {
          hasPaymentMethod
          ? <PaymentMethod
              card={cards[0]}
              onContinuePayment={handleContinuePayment}
              onReplacePaymentMethod={() => setHasPaymentMethod(false)}
            />
          : payment && <IFrame
              src={payment.link}
              frameBorder="0"
              title="Payment Details"
              onLoad={handleIframeLoad}
            />
        }
      </div>
    </div>
  );
}
