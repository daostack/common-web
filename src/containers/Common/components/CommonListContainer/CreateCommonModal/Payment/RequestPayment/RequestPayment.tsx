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
import { ScreenSize } from "@/shared/constants";
import {
  Common,
  CommonContributionType,
  Card,
} from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice } from "@/shared/utils";
import { PaymentPayload } from "../../../../../interfaces";
import {
  getCommonsList,
  makeImmediateContribution,
  loadUserCards,
} from "../../../../../store/actions";
import { subscribeToCardChange } from "../../../../../store/api";
import { Progress } from "../Progress";
import PayMeService from "../../../../../../../services/PayMeService";
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
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const selectedAmount = paymentData.contributionAmount;
  const contributionTypeText = (contributionType === CommonContributionType.Monthly)
                                ? "monthly"
                                : "one-time";
  const newCardId = useMemo(() => uuidv4(), []);

  const finishPayment = useCallback(() => {
    onFinish();

    if (!isCommonActive) {
      dispatch(getCommonsList.request());
    }
  }, [isCommonActive, onFinish, dispatch]);

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  const makeImmediateContributionRequest = useCallback(() => {
    if (!paymentData.contributionAmount)
      return;

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
        || (hasPaymentMethod === null)
        || payment
        || isPaymentLoading
        || !common
        || !paymentData.contributionAmount
      ) return;

      try {
        setState((nextState) => ({
          ...nextState,
          isPaymentLoading: true,
        }));

        const createdPayment = await PayMeService.createBuyerTokenPage({
          cardId: newCardId as string,
        });

        setShouldShowGoBackButton(true);

        setState((nextState) => ({
          ...nextState,
          payment: createdPayment,
          isPaymentLoading: false,
        }));
      } catch (error) {
        onError((error as any).message || "Something went wrong");
      }
    })();
  }, [
    hasPaymentMethod,
    payment,
    common,
    isPaymentLoading,
    paymentData.contributionAmount,
    onError,
    setShouldShowGoBackButton,
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
      onError((error as any).message || "Error during subscription to payment status change");
    }
  }, [
    isPaymentIframeLoaded,
    payment,
    newCardId,
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
