import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoginModalState } from "@/containers/Auth/store/actions";
import { selectUser } from "@/containers/Auth/store/selectors";
import { Loader } from "@/shared/components";
import { useHeader, useQueryParams } from "@/shared/hooks";
import {
  InitialStep,
  MemberAdmittanceStep,
  PaymentStep,
  Success,
  UserDetailsStep,
} from "../../components/DeadSeaIntegrationContainer";
import { DeadSeaIntegrationStep } from "./constants";
import { getAmount } from "./helpers";
import "./index.scss";

const DeadSeaIntegrationContainer: FC = () => {
  const dispatch = useDispatch();
  const { updateHeaderState } = useHeader();
  const queryParams = useQueryParams();
  const [step, setStep] = useState(DeadSeaIntegrationStep.InitialStep);
  const [amount, setAmount] = useState(() => getAmount(queryParams));
  const [supportPlan, setSupportPlan] = useState("");
  const user = useSelector(selectUser());
  const isInitialLoading = !user && step === DeadSeaIntegrationStep.UserDetails;

  const handleInitialStepFinish = (amount: number) => {
    setAmount(amount);
    setStep(DeadSeaIntegrationStep.UserDetails);
  };

  const handleUserDetailsStepFinish = (supportPlan: string) => {
    setStep(DeadSeaIntegrationStep.MemberAdmittance);
    setSupportPlan(supportPlan);
  };

  const handleMemberAdmittanceStepFinish = () => {
    setStep(DeadSeaIntegrationStep.Payment);
  };

  const handlePaymentStepFinish = () => {
    setStep(DeadSeaIntegrationStep.Success);
  };

  useEffect(() => {
    if (!user && amount && step === DeadSeaIntegrationStep.UserDetails) {
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
      setStep(DeadSeaIntegrationStep.InitialStep);
    }
  }, [user]);

  useEffect(() => {
    updateHeaderState({
      shouldHideHeader: true,
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
      case DeadSeaIntegrationStep.InitialStep:
        return (
          <InitialStep amount={amount} onFinish={handleInitialStepFinish} />
        );
      case DeadSeaIntegrationStep.UserDetails:
        return user ? (
          <UserDetailsStep user={user} onFinish={handleUserDetailsStepFinish} />
        ) : null;
      case DeadSeaIntegrationStep.MemberAdmittance:
        return (
          <MemberAdmittanceStep
            description={supportPlan}
            onFinish={handleMemberAdmittanceStepFinish}
          />
        );
      case DeadSeaIntegrationStep.Payment:
        return (
          <PaymentStep
            amount={amount}
            onAmountChange={setAmount}
            onFinish={handlePaymentStepFinish}
          />
        );
      case DeadSeaIntegrationStep.Success:
        return <Success />;
      default:
        return null;
    }
  };

  return (
    <div className="dead-sea-integration">
      <div className="dead-sea-integration__content">
        <div className="dead-sea-integration__main-image-wrapper">
          <img
            className="dead-sea-integration__main-image"
            src="/assets/images/dead-sea-integration.png"
            alt="Dead Sea"
          />
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DeadSeaIntegrationContainer;
