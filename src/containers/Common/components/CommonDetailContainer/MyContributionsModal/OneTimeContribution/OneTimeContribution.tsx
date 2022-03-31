import React, { useEffect, useState, FC, ReactNode } from "react";
import { Common } from "@/shared/models";
import { AmountSelection } from "./AmountSelection";

interface OneTimeContributionProps {
  common: Common;
  setTitle: (title: ReactNode) => void;
}

const OneTimeContribution: FC<OneTimeContributionProps> = (props) => {
  const { common, setTitle } = props;
  const [contributionAmount, setContributionAmount] = useState<
    number | undefined
  >();

  const handleAmountSelect = (amount: number) => {
    console.log(amount);
  };

  useEffect(() => {
    setTitle("My contributions");
  }, [setTitle]);

  const renderContent = () => {
    return (
      <AmountSelection
        common={common}
        contributionAmount={contributionAmount}
        onSelect={handleAmountSelect}
      />
    );
  };

  return renderContent();
};

export default OneTimeContribution;
