import React, { useEffect, useState, FC, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader, Modal } from "@/shared/components";
import { ModalProps } from "@/shared/interfaces";
import { Common, Payment } from "@/shared/models";
import { getUserContributionsToCommon } from "../../../store/actions";
import { General } from "./General";
import { MonthlyContributionCharges } from "./MonthlyContributionCharges";
import { OneTimeContribution } from "./OneTimeContribution";
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
  const [userPayments, setUserPayments] = useState<Payment[] | null>(null);
  const [errorText, setErrorText] = useState("");
  const user = useSelector(selectUser());
  const isLoading = !userPayments;

  const setGoBackHandler = (handler: GoBackHandler | null) => {
    setOnGoBack(() => handler ?? undefined);
  };

  const goToGeneralStage = () => {
    setStage(MyContributionsStage.General);
    setGoBackHandler(onClose);
  };

  const goToMonthlyContributionStage = () => {
    setStage(MyContributionsStage.MonthlyContributionCharges);
    setGoBackHandler(goToGeneralStage);
  };

  const goToOneTimeContributionStage = () => {
    setStage(MyContributionsStage.OneTimeContribution);
    setGoBackHandler(goToGeneralStage);
  };

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setStage(MyContributionsStage.Error);
  };

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
      // setStage(MyContributionsStage.General);
    }
  }, [isShowing]);

  const renderContent = () => {
    switch (stage) {
      case MyContributionsStage.General:
        return userPayments ? (
          <General
            payments={userPayments}
            setTitle={setTitle}
            commonName={common.name}
            goToMonthlyContribution={goToMonthlyContributionStage}
            goToOneTimeContribution={goToOneTimeContributionStage}
          />
        ) : null;
      case MyContributionsStage.MonthlyContributionCharges:
        return userPayments ? (
          <MonthlyContributionCharges
            payments={userPayments}
            setTitle={setTitle}
            goToOneTimeContribution={goToOneTimeContributionStage}
          />
        ) : null;
      case MyContributionsStage.OneTimeContribution:
        return (
          <OneTimeContribution
            common={common}
            setTitle={setTitle}
            onError={handleError}
          />
        );
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
      mobileFullScreen
    >
      {isLoading ? <Loader /> : renderContent()}
    </Modal>
  );
};

export default MyContributionsModal;
