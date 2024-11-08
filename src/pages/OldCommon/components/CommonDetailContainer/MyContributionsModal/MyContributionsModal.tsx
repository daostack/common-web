import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FC,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/pages/Auth/store/selectors";
import { Loader, Modal } from "@/shared/components";
import { ScreenSize } from "@/shared/constants";
import { ModalProps } from "@/shared/interfaces";
import { Common, Payment, Subscription } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import {
  getCommonDetail,
  getUserContributionsToCommon,
  getUserSubscriptionToCommon,
} from "../../../store/actions";
import { ChangeMonthlyContribution } from "./ChangeMonthlyContribution";
import { CreateSubscription } from "./CreateSubscription";
import { Error } from "./Error";
import { General } from "./General";
import { MonthlyContributionCharges } from "./MonthlyContributionCharges";
import { OneTimeContribution } from "./OneTimeContribution";
import { ReplacePaymentMethod } from "./ReplacePaymentMethod";
import { MyContributionsContext, MyContributionsContextValue } from "./context";
import { GoBackHandler } from "./types";
import "./index.scss";

enum MyContributionsStage {
  General,
  MonthlyContributionCharges,
  OneTimeContribution,
  ChangeMonthlyContribution,
  ReplacePaymentMethod,
}

interface MyContributionsModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
  isSubCommon: boolean;
}

const MyContributionsModal: FC<MyContributionsModalProps> = (props) => {
  const { isShowing, onClose, common } = props;
  const dispatch = useDispatch();
  const [stage, setStage] = useState<MyContributionsStage>(
    MyContributionsStage.General,
  );
  const [title, setTitle] = useState<ReactNode>(common.name);
  const [onGoBack, setOnGoBack] = useState<GoBackHandler>(() => onClose);
  const [goBackForStages, setGoBackForStages] = useState<(() => void) | null>(
    null,
  );
  const [isUserContributionsFetchStarted, setIsUserContributionsFetchStarted] =
    useState(false);
  const [shouldShowClosePrompt, setShouldShowClosePrompt] = useState(false);
  const [userPayments, setUserPayments] = useState<Payment[] | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isSubscriptionFetchFinished, setIsSubscriptionFetchFinished] =
    useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const shouldBeWithoutHorizontalPadding =
    isMobileView &&
    [
      MyContributionsStage.General,
      MyContributionsStage.MonthlyContributionCharges,
    ].includes(stage);
  const user = useSelector(selectUser());
  const userId = user?.uid;
  const isLoading = !userPayments || !isSubscriptionFetchFinished;

  const setGoBackHandler = useCallback((handler: GoBackHandler | null) => {
    setOnGoBack(() => handler ?? undefined);
  }, []);

  const goToGeneralStage = useCallback(() => {
    setStage(MyContributionsStage.General);
    setGoBackHandler(onClose);
  }, [setGoBackHandler, onClose]);

  const goToMonthlyContributionStage = useCallback(() => {
    setStage(MyContributionsStage.MonthlyContributionCharges);
    setGoBackHandler(goToGeneralStage);
  }, [setGoBackHandler, goToGeneralStage]);

  const goToReplacePaymentMethodStage = useCallback(() => {
    setStage(MyContributionsStage.ReplacePaymentMethod);
    setGoBackHandler(goToMonthlyContributionStage);
  }, [setGoBackHandler, goToMonthlyContributionStage]);

  const goToOneTimeContributionStage = useCallback(() => {
    setStage(MyContributionsStage.OneTimeContribution);
    setGoBackForStages(() => goToGeneralStage);
    setGoBackHandler(goToGeneralStage);
  }, [setGoBackHandler, goToGeneralStage]);

  const goToOneTimeContributionStageFromMonthly = useCallback(() => {
    setStage(MyContributionsStage.OneTimeContribution);
    setGoBackForStages(() => goToMonthlyContributionStage);
    setGoBackHandler(goToMonthlyContributionStage);
  }, [setGoBackHandler, goToMonthlyContributionStage]);

  const goToChangeMonthlyContributionStage = useCallback(() => {
    setStage(MyContributionsStage.ChangeMonthlyContribution);
    setGoBackForStages(() => goToGeneralStage);
    setGoBackHandler(goToGeneralStage);
  }, [setGoBackHandler, goToGeneralStage]);

  const goToChangeMonthlyContributionStageFromMonthly = useCallback(() => {
    setStage(MyContributionsStage.ChangeMonthlyContribution);
    setGoBackForStages(() => goToMonthlyContributionStage);
    setGoBackHandler(goToMonthlyContributionStage);
  }, [setGoBackHandler, goToMonthlyContributionStage]);

  const handleOneTimeContributionFinish = useCallback(
    (payment: Payment) => {
      setUserPayments((nextUserPayments) =>
        nextUserPayments ? [payment, ...nextUserPayments] : [payment],
      );
      dispatch(
        getCommonDetail.request({
          payload: common.id,
        }),
      );

      if (goBackForStages) {
        goBackForStages();
      } else {
        goToGeneralStage();
      }
    },
    [dispatch, common.id, goBackForStages, goToGeneralStage],
  );

  const handleChangeMonthlyContributionFinish = useCallback(
    (subscription: Subscription) => {
      setSubscription(subscription);
      setIsUserContributionsFetchStarted(false);

      if (goBackForStages) {
        goBackForStages();
      } else {
        goToGeneralStage();
      }
    },
    [goBackForStages, goToGeneralStage],
  );

  const handleCreateMonthlyContributionFinish = useCallback(
    (subscription: Subscription) => {
      setSubscription(subscription);
      setIsUserContributionsFetchStarted(false);

      if (goBackForStages) {
        goBackForStages();
      } else {
        goToGeneralStage();
      }
    },
    [goBackForStages, goToGeneralStage],
  );

  const handleError = useCallback((errorText: string) => {
    setErrorText(errorText);
  }, []);

  const handleErrorFinish = useCallback(() => {
    setErrorText(null);
    goToGeneralStage();
  }, [goToGeneralStage]);

  useEffect(() => {
    if (!isShowing || isUserContributionsFetchStarted || !userId) {
      return;
    }

    setIsUserContributionsFetchStarted(true);
    dispatch(
      getUserContributionsToCommon.request({
        payload: {
          userId,
          commonId: common.id,
        },
        callback: (error, payments) => {
          if (error || !payments) {
            handleError("Something went wrong");
          } else {
            setUserPayments(payments);
          }
        },
      }),
    );
    dispatch(
      getUserSubscriptionToCommon.request({
        payload: {
          userId,
          commonId: common.id,
        },
        callback: (error, subscription) => {
          if (error || typeof subscription === "undefined") {
            handleError("Something went wrong");
          } else {
            setSubscription(subscription);
            setIsSubscriptionFetchFinished(true);
          }
        },
      }),
    );
  }, [
    dispatch,
    isShowing,
    isUserContributionsFetchStarted,
    userId,
    common.id,
    handleError,
  ]);

  useEffect(() => {
    if (!isShowing) {
      setUserPayments(null);
      setSubscription(null);
      setIsUserContributionsFetchStarted(false);
      setIsSubscriptionFetchFinished(false);
      setErrorText(null);
      setStage(MyContributionsStage.General);
    }
  }, [isShowing]);

  const contextValue = useMemo<MyContributionsContextValue>(
    () => ({
      setTitle,
      setShouldShowClosePrompt,
      setOnGoBack: setGoBackHandler,
      onError: handleError,
    }),
    [setGoBackHandler, handleError],
  );

  const renderContent = () => {
    if (!isMobileView && errorText !== null) {
      return <Error errorText={errorText} onFinish={handleErrorFinish} />;
    }

    switch (stage) {
      case MyContributionsStage.General:
        return userPayments ? (
          <General
            payments={userPayments}
            subscription={subscription}
            commonName={common.name}
            goToMonthlyContribution={goToMonthlyContributionStage}
            goToOneTimeContribution={goToOneTimeContributionStage}
            goToChangeMonthlyContribution={goToChangeMonthlyContributionStage}
          />
        ) : null;
      case MyContributionsStage.MonthlyContributionCharges:
        return userPayments ? (
          <MonthlyContributionCharges
            payments={userPayments}
            goToOneTimeContribution={goToOneTimeContributionStageFromMonthly}
            goToChangeMonthlyContribution={
              goToChangeMonthlyContributionStageFromMonthly
            }
            goToReplacePaymentMethod={goToReplacePaymentMethodStage}
          />
        ) : null;
      case MyContributionsStage.OneTimeContribution:
        return (
          <OneTimeContribution
            common={common}
            onFinish={handleOneTimeContributionFinish}
            goBack={goBackForStages || goToGeneralStage}
            isSubCommon={Boolean(common.directParent)}
          />
        );
      case MyContributionsStage.ChangeMonthlyContribution:
        return subscription ? (
          <ChangeMonthlyContribution
            currentSubscription={subscription}
            common={common}
            onFinish={handleChangeMonthlyContributionFinish}
            goBack={goBackForStages || goToGeneralStage}
          />
        ) : (
          <CreateSubscription
            common={common}
            onFinish={handleCreateMonthlyContributionFinish}
            goBack={goBackForStages || goToGeneralStage}
            isSubCommon={Boolean(common.directParent)}
          />
        );
      case MyContributionsStage.ReplacePaymentMethod:
        return subscription ? (
          <ReplacePaymentMethod
            userCardId={subscription.cardId}
            goBack={goToMonthlyContributionStage}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <Modal
      className="my-contribution-modal"
      isShowing={isShowing}
      title={title}
      onClose={onClose}
      onGoBack={onGoBack}
      closePrompt={shouldShowClosePrompt}
      mobileFullScreen
      withoutHorizontalPadding={shouldBeWithoutHorizontalPadding}
    >
      <MyContributionsContext.Provider value={contextValue}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {renderContent()}
            {isMobileView && errorText !== null && (
              <Error errorText={errorText} onFinish={handleErrorFinish} />
            )}
          </>
        )}
      </MyContributionsContext.Provider>
    </Modal>
  );
};

export default MyContributionsModal;
