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
import PayMeService from "../../../../../services/PayMeService";
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
import { loadUserCards, makeImmediateContribution, } from "../../../store/actions";
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
    id: commonId,
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
  const [hasPaymentMethod, setHasPaymentMethod] = useState<boolean>(false);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = (screenSize === ScreenSize.Mobile);
  const contributionTypeText = (contributionType === CommonContributionType.Monthly)
                                ? "monthly"
                                : "one-time";

  const handleIframeLoad = useCallback(() => {
    setState((nextState) => ({ ...nextState, isPaymentIframeLoaded: true }));
  }, []);

  const handleContinuePayment = useCallback(() => {
    if (
      !hasPaymentMethod
      || !userData.contributionAmount
    ) return;

    dispatch(
      makeImmediateContribution.request({
        payload: {
          commonId,
          contributionType,
          amount: userData.contributionAmount,
          saveCard: true,
        },
        callback: (error, payment) => {
          if (error || !payment) {
            console.error(error?.message ||"Error during immediate payment's attemption");
            return;
          }

          return;
        },
      })
    );
  }, [
    hasPaymentMethod,
    userData.contributionAmount,
    commonId,
    contributionType,
    dispatch,
  ]);

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
      if (commonPayment || isCommonPaymentLoading || !common || !user?.uid) {
        return;
      }

      try {
        setState((nextState) => ({
          ...nextState,
          isCommonPaymentLoading: true,
        }));

        const createdCommonPayment = await PayMeService.createBuyerTokenPage({
          cardId: userData.cardId,
        });

        setState((nextState) => ({
          ...nextState,
          commonPayment: createdCommonPayment,
          isCommonPaymentLoading: false,
        }));
      } catch (error) {
        console.error("Error during payment page creation");
      }
    })();
  }, [commonPayment, isCommonPaymentLoading, userData, common, user]);

  useEffect(() => {
    if (!isPaymentIframeLoaded) {
      return;
    }

    try {
      return subscribeToCardChange(userData.cardId, (card) => {
        if (card) {
          setUserData((nextUserData) => ({ ...nextUserData, stage: 5 }));
        }
      });
    } catch (error) {
      console.error("Error during subscription to payment status change");
    }
  }, [isPaymentIframeLoaded, userData.cardId, setUserData]);

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
                onClick={handleContinuePayment}
              >
                Continue to payment
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
