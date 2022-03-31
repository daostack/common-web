import React, { useEffect, useState, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { AmountSelection } from "./AmountSelection";
import { Payment } from "./Payment";
import { OneTimeContributionStep } from "./constants";

interface OneTimeContributionProps {
  common: Common;
  setTitle: (title: ReactNode) => void;
  onError: (errorText: string) => void;
}

const OneTimeContribution: FC<OneTimeContributionProps> = (props) => {
  const { common, setTitle, onError } = props;
  const [step, setStep] = useState<OneTimeContributionStep>(
    OneTimeContributionStep.AmountSelection
  );
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();

  const handleAmountSelect = (amount: number) => {
    setContributionAmount(amount);
    setStep(OneTimeContributionStep.Payment);
  };

  const handlePaymentFinish = () => {
    console.log("handlePaymentFinish");
  };

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

  const renderContent = () => {
    switch (step) {
      case OneTimeContributionStep.AmountSelection:
        return (
          <AmountSelection
            common={common}
            contributionAmount={contributionAmount}
            onSelect={handleAmountSelect}
          />
        );
      case OneTimeContributionStep.Payment:
        return typeof contributionAmount === "number" ? (
          <Payment
            common={common}
            contributionAmount={contributionAmount}
            onFinish={handlePaymentFinish}
            onError={onError}
          />
        ) : null;
      default:
        return null;
    }
  };

  return renderContent();
};

export default OneTimeContribution;
