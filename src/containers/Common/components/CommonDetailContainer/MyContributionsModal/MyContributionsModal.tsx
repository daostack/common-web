import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  FC,
  ReactNode,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader, Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common, Payment } from "@/shared/models";
import { getUserContributionsToCommon } from "../../../store/actions";
import { General } from "./General";
import { MonthlyContributionCharges } from "./MonthlyContributionCharges";
import { OneTimeContribution } from "./OneTimeContribution";
import { MyContributionsContext, MyContributionsContextValue } from "./context";
import { GoBackHandler } from "./types";
import "./index.scss";

enum MyContributionsStage {
  General,
  MonthlyContributionCharges,
  OneTimeContribution,
  Error,
}

interface MyContributionsModalProps
  extends Pick<ModalProps, "isShowing" | "onClose"> {
  common: Common;
}

const MyContributionsModal: FC<MyContributionsModalProps> = (props) => {
  const { isShowing, onClose, common } = props;
  const dispatch = useDispatch();
  const [stage, setStage] = useState<MyContributionsStage>(
    MyContributionsStage.General
  );
  const [title, setTitle] = useState<ReactNode>(common.name);
  const [onGoBack, setOnGoBack] = useState<GoBackHandler>(() => onClose);
  const [
    isUserContributionsFetchStarted,
    setIsUserContributionsFetchStarted,
  ] = useState(false);
  const [
    shouldShowClosePrompt,
    setShouldShowClosePrompt,
  ] = useState(false);
  const [userPayments, setUserPayments] = useState<Payment[] | null>(null);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const isLoading = !userPayments;

  const setGoBackHandler = useCallback((handler: GoBackHandler | null) => {
    setOnGoBack(() => handler ?? undefined);
  }, []);

  const goToGeneralStage = useCallback(() => {
    setStage(MyContributionsStage.General);
    setGoBackHandler(onClose);
  }, [setGoBackHandler]);

  const goToMonthlyContributionStage = useCallback(() => {
    setStage(MyContributionsStage.MonthlyContributionCharges);
    setGoBackHandler(goToGeneralStage);
  }, [setGoBackHandler]);

  const goToOneTimeContributionStage = useCallback(() => {
    setStage(MyContributionsStage.OneTimeContribution);
    setGoBackHandler(goToGeneralStage);
  }, [setGoBackHandler]);

  const handleOneTimeContributionFinish = useCallback((payment: Payment) => {
    setUserPayments((nextUserPayments) =>
      nextUserPayments ? [payment, ...nextUserPayments] : [payment]
    );
    setStage(MyContributionsStage.General);
  }, []);

  const handleError = useCallback((errorText: string) => {
    setErrorText(errorText);
    setStage(MyContributionsStage.Error);
  }, []);

  useEffect(() => {
    if (!isShowing || isUserContributionsFetchStarted || !user?.uid) {
      return;
    }

    setIsUserContributionsFetchStarted(true);
    dispatch(
      getUserContributionsToCommon.request({
        payload: {
          userId: user.uid,
          commonId: common.id,
        },
        callback: (error, payments) => {
          if (error || !payments) {
            handleError("Something went wrong");
          } else {
            setUserPayments(payments);
          }
        },
      })
    );
  }, [
    dispatch,
    isShowing,
    isUserContributionsFetchStarted,
    user?.uid,
    common.id,
    handleError,
  ]);

  useEffect(() => {
    if (!isShowing) {
      setUserPayments(null);
      setIsUserContributionsFetchStarted(false);
      setStage(MyContributionsStage.General);
    }
  }, [isShowing]);

  const renderContent = () => {
    switch (stage) {
      case MyContributionsStage.General:
        return userPayments ? (
          <General
            payments={userPayments}
            commonName={common.name}
            goToMonthlyContribution={goToMonthlyContributionStage}
            goToOneTimeContribution={goToOneTimeContributionStage}
          />
        ) : null;
      case MyContributionsStage.MonthlyContributionCharges:
        return userPayments ? (
          <MonthlyContributionCharges
            payments={userPayments}
            goToOneTimeContribution={goToOneTimeContributionStage}
          />
        ) : null;
      case MyContributionsStage.OneTimeContribution:
        return (
          <OneTimeContribution
            common={common}
            onFinish={handleOneTimeContributionFinish}
            goBack={goToGeneralStage}
          />
        );
      default:
        return null;
    }
  };

  const contextValue = useMemo<MyContributionsContextValue>(
    () => ({
      setTitle,
      setShouldShowClosePrompt,
      setOnGoBack: setGoBackHandler,
      onError: handleError,
    }),
    [setGoBackHandler, handleError]
  );

  return (
    <Modal
      className="my-contribution-modal"
      isShowing={isShowing}
      title={title}
      onClose={onClose}
      onGoBack={onGoBack}
      closePrompt={shouldShowClosePrompt}
      mobileFullScreen
    >
      <MyContributionsContext.Provider value={contextValue}>
        {isLoading ? <Loader /> : renderContent()}
      </MyContributionsContext.Provider>
    </Modal>
  );
};

export default MyContributionsModal;
