import React, { FC } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useSupportersDataContext } from "@/pages/OldCommon/containers/SupportersContainer/context";
import { ButtonLink } from "@/shared/components";
import { ContributionType, MIN_CONTRIBUTION_ILS_AMOUNT, QueryParamKey, ROUTE_PATHS } from "@/shared/constants";
import { checkIsIFrame } from "@/shared/utils";
import { AmountSelection } from "../AmountSelection";
import { GeneralInfoWrapper } from "../GeneralInfoWrapper";
import "./index.scss";

interface InitialStepProps {
  amount: number;
  onFinish: (amount: number, contributionType: ContributionType) => void;
}

const InitialStep: FC<InitialStepProps> = (props) => {
  const { amount, onFinish } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "supporters",
  });
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
        minMonthlyAmount={supportersData?.minMonthlyAmount || MIN_CONTRIBUTION_ILS_AMOUNT}
        monthlyAmountToSelect={supportersData?.monthlyAmounts || []}
        minOneTimeAmount={supportersData?.minAmount || MIN_CONTRIBUTION_ILS_AMOUNT}
        oneTimeAmountsToSelect={supportersData?.amounts || []}
        preSubmitText={
          <p className="supporters-page-initial-step__pre-submit-text">
            <Trans
              t={t}
              i18nKey="communityManagedText"
              values={{ commonName: currentTranslation.title }}
            >
              <strong>{currentTranslation.title}</strong> is a community
              movement managed via{" "}
              <ButtonLink
                href={ROUTE_PATHS.HOME}
                target="_blank"
                rel="noopener noreferrer"
              >
                Common
              </ButtonLink>
            </Trans>
          </p>
        }
        submitButtonText={t("buttons.supportUsViaCommon")}
        onAmountChange={onFinish}
        getSubmitLink={isInsideIFrame ? getSubmitLink : undefined}
      />
    </GeneralInfoWrapper>
  );
};

export default InitialStep;
