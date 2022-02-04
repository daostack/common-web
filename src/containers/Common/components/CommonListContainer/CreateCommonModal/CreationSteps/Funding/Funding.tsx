import React, { useCallback, useRef, ReactElement, ReactNode } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "@/shared/utils";
import { Separator } from "@/shared/components";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Checkbox, CurrencyInput, Form, ToggleButtonGroup, ToggleButton } from "@/shared/components/Form/Formik";
import { CommonContributionType } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { MIN_CONTRIBUTION_VALUE } from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface FundingProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

interface FormValues {
  contributionType: CommonContributionType;
  minimumContribution?: number;
  isCommonJoinFree: boolean;
}

const getInitialValues = (
  data: IntermediateCreateCommonPayload
): FormValues => ({
  contributionType: data.contributionType,
  minimumContribution: data.contributionAmount || undefined,
  isCommonJoinFree: data.zeroContribution || false,
});

const getCurrencyInputLabel = (contributionType: CommonContributionType, isMobileView: boolean): ReactNode => {
  const contributionText = contributionType === CommonContributionType.OneTime ? "one-time" : "monthly";
  const additionalText = isMobileView && contributionType === CommonContributionType.Monthly
    ? ` (min. $${MIN_CONTRIBUTION_VALUE})`
    : "";

  return <>Minimum <strong>{contributionText}</strong> contribution{additionalText}</>;
};

const getCurrencyInputDescription = (contributionType: CommonContributionType, isMobileView: boolean): string => {
  const descriptionPieces = ["Set the minimum amount that new members will have to contribute in order to join this Common."];

  if (!isMobileView || contributionType !== CommonContributionType.Monthly) {
    descriptionPieces.push(`The minimum contribution allowed by credit card is $${MIN_CONTRIBUTION_VALUE}.`);
  }

  return descriptionPieces.join(" ");
};

export default function Funding({ currentStep, onFinish, creationData }: FundingProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const isMobileView = isMobile();

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>['onSubmit']>((values) => {
    onFinish({
      contributionType: values.contributionType,
      contributionAmount: values.minimumContribution || 0,
      zeroContribution: values.isCommonJoinFree,
    });
  }, [onFinish]);

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <>
      {!isMobileView && (
        <ModalHeaderContent>
          {progressEl}
        </ModalHeaderContent>
      )}
      <div className="create-common-funding">
        {isMobileView && progressEl}
        <Separator className="create-common-funding__separator" />
        <Formik
          initialValues={getInitialValues(creationData)}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values: { contributionType }, isValid }) => (
            <Form className="create-common-funding__form">
              <ToggleButtonGroup
                className="create-common-funding__field"
                name="contributionType"
                label="Contribution type"
                styles={{ label: "create-common-funding__field-label" }}
              >
                <ToggleButton value={CommonContributionType.OneTime}>
                  One-time
                </ToggleButton>
                <ToggleButton value={CommonContributionType.Monthly}>
                  Monthly
                </ToggleButton>
              </ToggleButtonGroup>
              <CurrencyInput
                className="create-common-funding__field"
                id="minimumContribution"
                name="minimumContribution"
                label={getCurrencyInputLabel(contributionType, isMobileView)}
                description={getCurrencyInputDescription(contributionType, isMobileView)}
                placeholder={`$${MIN_CONTRIBUTION_VALUE}`}
                allowDecimals={false}
                styles={{
                  label: "create-common-funding__field-label",
                  description: "create-common-funding__currency-input-description",
                  error: "create-common-funding__currency-input-error",
                }}
              />
              {contributionType === CommonContributionType.OneTime && (
                <Checkbox
                  className="create-common-funding__field"
                  id="isCommonJoinFree"
                  name="isCommonJoinFree"
                  label="Let users join the Common without a personal contribution"
                  styles={{
                    label: "create-common-funding__checkbox-label",
                  }}
                />
              )}
              <ModalFooter sticky>
                <div className="create-common-funding__modal-footer">
                  <button
                    key="funding-continue"
                    className="button-blue"
                    onClick={handleContinueClick}
                    disabled={!isValid}
                  >
                    Continue to Rules
                  </button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
