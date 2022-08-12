import React, { FC } from "react";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";

interface InitialStepProps {
  amount: number;
  onFinish: (amount: number) => void;
}

const DESCRIPTION =
  "The Dead Sea is one of nature’s wonders and the lowest place on earth. Due to diversion of water and over exploitation of minerals the Dead Sea is declining 1.2 meters every year and has already lost over 30% of its surface area. If we don’t act now, what will be left of the Sea, in our lifetime, will be just a puddle.";

const InitialStep: FC<InitialStepProps> = (props) => {
  const { amount, onFinish } = props;

  return (
    <GeneralInfoWrapper description={DESCRIPTION}>
      <AmountSelection amount={amount} onAmountChange={onFinish} />
    </GeneralInfoWrapper>
  );
};

export default InitialStep;
