import React, {
  useCallback,
  useMemo,
  useEffect,
  useState,
  ReactElement,
} from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  Loader,
  ModalHeaderContent,
  Separator,
  IFrame,
  PaymentMethod,
  Button,
  ModalFooter,
} from "@/shared/components";
import { ContributionType, ScreenSize } from "@/shared/constants";
import {
  Common,
  Card,
  Currency,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { MemberAdmittanceLimitations } from "@/shared/models/governance/proposals";
import { PaymentPayload } from "../../../../../interfaces";
import {
  getCommonsList,
  makeImmediateContribution,
  loadUserCards,
  createBuyerTokenPage,
} from "../../../../../store/actions";
import { subscribeToCardChange } from "../../../../../store/api";
import { Progress } from "../Progress";
import "./index.scss";

interface State {
  payment: { link: string } | null;
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
  memberAdmittanceOptions: MemberAdmittanceLimitations;
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
    memberAdmittanceOptions
  } = props;
  const {
    id: commonId,
  } = common;
  const dispatch = useDispatch();
  const [
    { payment, isPaymentLoading, isPaymentIframeLoaded },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const [cards, setUserCards] = useState<Card[]>([]);
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean | null>(null);
  const [isImmediatePaymentLoading, setIsImmediatePaymentLoading] = useState<boolean>(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const selectedAmount = paymentData.contributionAmount;
  const contributionType = memberAdmittanceOptions.minFeeMonthly ? ContributionType.Monthly : ContributionType.OneTime;
  const newCardId = useMemo(() => uuidv4(), []);

  const finishPayment = useCallback(() => {
    onFinish();

    dispatch(getCommonsList.request());
  }, [onFinish, dispatch]);

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  const makeImmediateContributionRequest = useCallback(() => {
    if (!paymentData.contributionAmount)
      return;
    
    setIsImmediatePaymentLoading(true);

    dispatch(
      makeImmediateContribution.request({
        payload: {
          commonId,
          contributionType,
          price: { amount: paymentData.contributionAmount, currency: Currency.ILS },
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
    paymentData.contributionAmount,
    commonId,
    contributionType,
    finishPayment,
    onError,
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
        setHasPaymentMethod(Boolean(cards) && Boolean(cards.length));
      }
    }));
  }, [dispatch, onError]);

  useEffect(() => {
    (async () => {
      if (
        hasPaymentMethod
        || (hasPaymentMethod === null)
        || payment
        || isPaymentLoading
        || !common
        || !paymentData.contributionAmount
      ) return;

      setState((nextState) => ({
        ...nextState,
        isPaymentLoading: true,
      }));

      dispatch(
        createBuyerTokenPage.request({
          payload: { cardId: newCardId },
          callback: (error, payment) => {
            if (error || !payment) {
              onError(error?.message || "Error during payment page creation");
              return;
            }

            setShouldShowGoBackButton(true);

            setState((nextState) => ({
              ...nextState,
              payment,
              isPaymentLoading: false,
            }));
          },
        })
      );
    })();
  }, [
    hasPaymentMethod,
    newCardId,
    payment,
    common,
    isPaymentLoading,
    paymentData.contributionAmount,
    onError,
    setShouldShowGoBackButton,
    dispatch,
  ]);

  useEffect(() => {
    if (
      !isPaymentIframeLoaded
      || !payment
      || !newCardId
    ) return;

    try {
      return subscribeToCardChange(newCardId, (card) => {
        if (card)
          makeImmediateContributionRequest();
      });
    } catch (error) {
      onError((error as Error).message || "Error during subscription to payment status change");
    }
  }, [
    isPaymentIframeLoaded,
    payment,
    makeImmediateContributionRequest,
    newCardId,
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
          {contributionType})
        </strong>{" "}
        to this Common.
      </p>

      <Separator className="create-common-payment__separator" />

      <div className="create-common-payment__content">
        {
          (
            (!isPaymentIframeLoaded && !hasPaymentMethod)
            || isImmediatePaymentLoading
          ) && <Loader className="create-common-payment__loader" />
        }
        {
          hasPaymentMethod
          ? <PaymentMethod
              card={cards[0]}
              onReplacePaymentMethod={() => setHasPaymentMethod(false)}
            />
          : payment && <IFrame
              src={payment.link}
              frameBorder="0"
              title="Payment Details"
              onLoad={handleIframeLoad}
            />
        }
        {
          hasPaymentMethod && <ModalFooter sticky>
            <div className="create-common-payment__continue-button-wrapper">
              <Button
                key="request-payment-continue"
                className="create-common-payment__continue-button"
                shouldUseFullWidth={isMobileView}
                disabled={isImmediatePaymentLoading}
                onClick={makeImmediateContributionRequest}
              >
                Continue to payment
              </Button>
            </div>
          </ModalFooter>
        }
      </div>
    </div>
  );
}