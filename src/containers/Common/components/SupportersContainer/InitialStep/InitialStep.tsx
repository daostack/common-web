import React, { FC } from "react";
import { useLocation } from "react-router-dom";
import { useSupportersDataContext } from "@/containers/Common/containers/SupportersContainer/context";
import { ButtonLink } from "@/shared/components";
import { QueryParamKey, ROUTE_PATHS } from "@/shared/constants";
import { checkIsIFrame } from "@/shared/utils";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import "./index.scss";

interface InitialStepProps {
  amount: number;
  onFinish: (amount: number) => void;
}

const InitialStep: FC<InitialStepProps> = (props) => {
  const { amount, onFinish } = props;
  const location = useLocation();
  const { supportersData, currentTranslation } = useSupportersDataContext();
  const isInsideIFrame = checkIsIFrame();

  const getSubmitLink = (amount: number): string =>
    `${location.pathname}?${QueryParamKey.SupportersFlowAmount}=${amount}`;

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper
      title={currentTranslation.title}
      description={currentTranslation.description}
    >
      <AmountSelection
        amount={amount}
        amountsToSelect={supportersData?.amounts || []}
        preSubmitText={
          <p className="supporters-page-initial-step__pre-submit-text">
            <strong>{currentTranslation.title}</strong> is a community movement
            managed via{" "}
            <ButtonLink
              href={ROUTE_PATHS.HOME}
              target="_blank"
              rel="noopener noreferrer"
            >
              Common
            </ButtonLink>
          </p>
        }
        submitButtonText="Support us via Common"
        onAmountChange={onFinish}
        getSubmitLink={isInsideIFrame ? getSubmitLink : undefined}
      />
    </GeneralInfoWrapper>
  );
};

export default InitialStep;
