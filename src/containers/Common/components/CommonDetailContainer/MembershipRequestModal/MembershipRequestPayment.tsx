import React, {
  useCallback,
  useEffect,
  useState,
  ReactElement,
} from "react";
import {
  useSelector,
  useDispatch,
} from "react-redux";

import "./index.scss";
import { IStageProps } from "./MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import {
  Loader,
  IFrame,
  PaymentMethod,
  ModalFooter,
  Button,
} from "@/shared/components";
import { CommonPayment, Card, Common, } from "../../../../../shared/models";
import { formatPrice } from "../../../../../shared/utils";
import { CommonContributionType } from "../../../../../shared/models";
import { subscribeToCardChange } from "../../../store/api";
import {
  loadUserCards,
  createBuyerTokenPage,
} from "../../../store/actions";
import { getScreenSize } from "@/shared/store/selectors";
import { ScreenSize } from "@/shared/constants";

interface State {
  commonPayment: CommonPayment | null;
  isCommonPaymentLoading: boolean;
  isPaymentIframeLoaded: boolean;
}

const INITIAL_STATE: State = {
  commonPayment: null,
  isCommonPaymentLoading: false,
  isPaymentIframeLoaded: false,
};

export default function MembershipRequestPayment(
  props: IStageProps
): ReactElement {
  const { userData, setUserData, common } = props;
  const {
    metadata: { contributionType },
  } = common as Common;
  const dispatch = useDispatch();
  const user = useSelector(selectUser());
  const [
    {
      commonPayment,
      isCommonPaymentLoading,
      isPaymentIframeLoaded,
    },
    setState,
  ] = useState<State>(INITIAL_STATE);
  const [cards, setUserCards] = useState<Card[]>([]);
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const contributionTypeText = (contributionType === CommonContributionType.Monthly)
                                ? "monthly"
                                : "one-time";

  const handleIframeLoad = useCallback(
    () => setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true })),
    [setState]
  );

  const finishPayment = useCallback(
    () => setUserData((nextUserData) => ({ ...nextUserData, stage: 5 })),
    [setUserData]
  );

  useEffect(() => {
    dispatch(loadUserCards.request({
      callback: (error, cards) => {
        if (error || !cards) {
          console.error(error?.message ||"Error trying to load user's cards");
          return;
        }

        setUserCards(cards);
        setHasPaymentMethod(!!cards && !!cards.length);
      }
    }));
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (
        hasPaymentMethod
        || (hasPaymentMethod === null)
        || commonPayment
        || isCommonPaymentLoading
        || !common
        || !user?.uid
      ) return;

      setState((nextState) => ({
        ...nextState,
        isCommonPaymentLoading: true,
      }));

      dispatch(
        createBuyerTokenPage.request({
          payload: { cardId: userData.cardId },
          callback: (error, payment) => {
            if (error || !payment) {
              console.error(error?.message || "Error during payment page creation");
              return;
            }

            setState((nextState) => ({
              ...nextState,
              commonPayment: payment,
              isCommonPaymentLoading: false,
            }));
          },
        })
      );
    })();
  }, [
    commonPayment,
    isCommonPaymentLoading,
    userData,
    common,
    user,
    hasPaymentMethod,
    dispatch,
  ]);

  useEffect(() => {
    if (
      hasPaymentMethod
      || (hasPaymentMethod === null)
      || !isPaymentIframeLoaded
      || !commonPayment
    ) return;

    try {
      return subscribeToCardChange(userData.cardId, (card) => {
        if (card)
          finishPayment();
      });
    } catch (error) {
      console.error((error as Error).message || "Error during subscription to payment status change");
    }
  }, [
    isPaymentIframeLoaded,
    commonPayment,
    userData.cardId,
    finishPayment,
    hasPaymentMethod,
  ]);

  return (
    <div className="membership-request-content membership-request-payment">
      <div className="sub-title">Payment Details</div>
      <div className="sub-text">
        You are contributing{" "}
        <strong className="membership-request-payment__amount">
          {formatPrice(userData.contributionAmount, { shouldMillify: false })} (
          {contributionTypeText})
        </strong>{" "}
        to this Common.
      </div>
      <div className="membership-request-payment__content">
        {
          (!isPaymentIframeLoaded && !hasPaymentMethod)
          && <Loader className="membership-request-payment__loader" />
        }
        {
          hasPaymentMethod
          ? <PaymentMethod
              card={cards[0]}
              onReplacePaymentMethod={() => setHasPaymentMethod(false)}
            />
          : commonPayment && <IFrame
              src={commonPayment.link}
              frameBorder="0"
              title="Payment Details"
              onLoad={handleIframeLoad}
            />
        }
      </div>
      {
          hasPaymentMethod && <ModalFooter sticky>
            <div className="membership-request-payment__continue-button-wrapper">
              <Button
                key="membership-request-payment-continue"
                className="membership-request-payment__continue-button"
                shouldUseFullWidth={isMobileView}
                onClick={finishPayment}
              >
                Continue
              </Button>
            </div>
          </ModalFooter>
      }
      <span className="membership-rejected-text">
        If your membership request will not be accepted, you will not be
        charged.
      </span>
    </div>
  );
}
