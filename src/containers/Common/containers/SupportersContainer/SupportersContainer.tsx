import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useFooter, useHeader, useQueryParams } from "@/shared/hooks";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { SupportersStep } from "./constants";
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
  const queryParams = useQueryParams();
  const [amount, setAmount] = useState(() => getAmount(queryParams));
  const [step, setStep] = useState(
    amount ? SupportersStep.UserDetails : SupportersStep.InitialStep
  );
  const [supportPlan, setSupportPlan] = useState("");
  const user = useSelector(selectUser());
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
    if (!user && amount && step === SupportersStep.UserDetails) {
      dispatch(
        setLoginModalState({
          isShowing: true,
          title: "Dead Sea Guardians Common",
          canCloseModal: false,
          shouldShowUserDetailsAfterSignUp: false,
        })
      );
    }
  }, [dispatch, user, amount, step]);

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
    return <div>Content</div>;
  };

  return (
    <div className="supporters-page">
      <div className="supporters-page__content">
        <div className="supporters-page__main-image-wrapper">
          <img
            className="supporters-page__main-image"
            src="/assets/images/supporters-page.png"
            alt="Dead Sea"
          />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default SupportersContainer;
