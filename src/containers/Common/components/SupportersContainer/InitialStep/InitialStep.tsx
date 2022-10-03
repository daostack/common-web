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

const DESCRIPTION =
  "The Dead Sea is one of nature’s wonders and the lowest place on earth. Due to diversion of water and over exploitation of minerals the Dead Sea is declining 1.2 meters every year and has already lost over 30% of its surface area. If we don’t act now, what will be left of the Sea, in our lifetime, will be just a puddle.";

const InitialStep: FC<InitialStepProps> = (props) => {
  const { amount, onFinish } = props;
  const location = useLocation();
  const { currentTranslation } = useSupportersDataContext();
  const isInsideIFrame = checkIsIFrame();

  const getSubmitLink = (amount: number): string =>
    `${location.pathname}?${QueryParamKey.SupportersFlowAmount}=${amount}`;

  if (!currentTranslation) {
    return null;
  }

  return (
    <GeneralInfoWrapper
      title={currentTranslation.title}
      description={DESCRIPTION}
    >
      <AmountSelection
        amount={amount}
        preSubmitText={
          <p className="supporters-page-initial-step__pre-submit-text">
            DSG is a community movement managed via{" "}
            <ButtonLink
              href={ROUTE_PATHS.HOME}
              target="_blank"
              rel="noopener noreferrer"
            >
              Common
            </ButtonLink>
          </p>
        }
        submitButtonText="Support the Community"
        onAmountChange={onFinish}
        getSubmitLink={isInsideIFrame ? getSubmitLink : undefined}
      />
    </GeneralInfoWrapper>
  );
};

export default InitialStep;
