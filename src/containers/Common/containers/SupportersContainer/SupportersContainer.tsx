import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFooter, useHeader, useQueryParams } from "@/shared/hooks";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { useCommon, useSupportersData } from "@/shared/hooks/useCases";
import {
  InitialStep,
  MemberAdmittanceStep,
  PaymentStep,
  Success,
  UserDetailsStep,
} from "../../components/SupportersContainer";
import { SupportersStep } from "./constants";
import { SupportersDataContext, SupportersDataContextValue } from "./context";
import { getAmount } from "./helpers";
import "./index.scss";

interface SupportersContainerRouterParams {
  id: string;
}

const SupportersContainer = () => {
  const { id: commonId } = useParams<SupportersContainerRouterParams>();
  const dispatch = useDispatch();
  const { updateHeaderState } = useHeader();
  const { updateFooterState } = useFooter();
  const { data: common, fetched: isCommonFetched, fetchCommon } = useCommon();
  const {
    data: supportersData,
    fetched: isSupportersDataFetched,
    fetchSupportersData,
  } = useSupportersData();
  const queryParams = useQueryParams();
  const [amount, setAmount] = useState(() => getAmount(queryParams));
  const [step, setStep] = useState(
    amount ? SupportersStep.UserDetails : SupportersStep.InitialStep
  );
  const [supportPlan, setSupportPlan] = useState("");
  const user = useSelector(selectUser());
  const currentTranslation =
    (supportersData &&
      supportersData.translations[supportersData.defaultLocale]) ||
    null;
  const isMainDataFetched = isCommonFetched && isSupportersDataFetched;
  const isInitialLoading = !user && step === SupportersStep.UserDetails;

  const handleInitialStepFinish = (amount: number) => {
    setAmount(amount);
    setStep(SupportersStep.UserDetails);
  };

  const handleUserDetailsStepFinish = (supportPlan: string) => {
    setStep(SupportersStep.MemberAdmittance);
    setSupportPlan(supportPlan);
  };

  const handleMemberAdmittanceStepFinish = () => {
    setStep(SupportersStep.Payment);
  };

  const handlePaymentStepFinish = () => {
    setStep(SupportersStep.Success);
  };

  useEffect(() => {
    fetchCommon(commonId);
    fetchSupportersData(commonId);
  }, []);

  useEffect(() => {
    if (
      !user &&
      currentTranslation &&
      amount &&
      step === SupportersStep.UserDetails
    ) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          title: currentTranslation.title,
          canCloseModal: false,
          shouldShowUserDetailsAfterSignUp: false,
        })
      );
    }
  }, [dispatch, user, currentTranslation, amount, step]);

  useEffect(() => {
    if (!user) {
      setStep(amount ? SupportersStep.UserDetails : SupportersStep.InitialStep);
    }
  }, [user]);

  useEffect(() => {
    updateHeaderState({
      shouldHideHeader: true,
    });
    updateFooterState({
      shouldHideFooter: true,
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const renderContent = () => {
    if (isInitialLoading) {
      return <Loader />;
    }

    switch (step) {
      case SupportersStep.InitialStep:
        return (
          <InitialStep amount={amount} onFinish={handleInitialStepFinish} />
        );
      case SupportersStep.UserDetails:
        return user ? (
          <UserDetailsStep user={user} onFinish={handleUserDetailsStepFinish} />
        ) : null;
      case SupportersStep.MemberAdmittance:
        return (
          <MemberAdmittanceStep
            description={supportPlan}
            onFinish={handleMemberAdmittanceStepFinish}
          />
        );
      case SupportersStep.Payment:
        return (
          <PaymentStep
            amount={amount}
            onAmountChange={setAmount}
            onFinish={handlePaymentStepFinish}
          />
        );
      case SupportersStep.Success:
        return <Success />;
      default:
        return null;
    }
  };

  const contextValue = useMemo<SupportersDataContextValue>(
    () => ({
      supportersData,
      currentTranslation,
    }),
    [supportersData, currentTranslation]
  );

  if (!isMainDataFetched) {
    return <Loader />;
  }

  return (
    <div className="supporters-page">
      {!common && <p>Couldn’t find common with id = "{commonId}"</p>}
      {common && !supportersData && (
        <p>Supporters flow is not supported by common "{common.name}".</p>
      )}
      {common && supportersData && currentTranslation && (
        <div className="supporters-page__content">
          <div className="supporters-page__main-image-wrapper">
            <img
              className="supporters-page__main-image"
              src={supportersData.photoURL}
              alt={currentTranslation.title}
            />
          </div>
          <SupportersDataContext.Provider value={contextValue}>
            {renderContent()}
          </SupportersDataContext.Provider>
        </div>
      )}
    </div>
  );
};

export default SupportersContainer;
