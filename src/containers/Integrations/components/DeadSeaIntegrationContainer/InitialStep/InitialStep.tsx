import React, { FC } from "react";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface InitialStepProps {
  amount: number;
  onFinish: (amount: number) => void;
}

const InitialStep: FC<InitialStepProps> = (props) => {
  const { amount, onFinish } = props;

  return (
    <GeneralInfoWrapper>
      <AmountSelection amount={amount} onAmountChange={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default InitialStep;
