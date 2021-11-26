import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "@/shared/utils";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Checkbox, CurrencyInput, Form, ToggleButtonGroup, ToggleButton } from "@/shared/components/Form/Formik";
import { ContributionType } from "@/shared/constants/contributionType";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import { MIN_CONTRIBUTION_VALUE } from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface FundingProps {
  currentStep: number;
  onFinish: () => void;
}

interface FormValues {
  contributionType: ContributionType;
  minimumContribution?: number;
  isCommonJoinFree: boolean;
}

const INITIAL_VALUES: FormValues = {
  contributionType: ContributionType.OneTime,
  isCommonJoinFree: false,
};

export default function Funding({ currentStep, onFinish }: FundingProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const isMobileView = isMobile();

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>['onSubmit']>((values) => {
    onFinish();
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
        <Separator />
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values: { contributionType }, errors, touched, isValid }) => (
            <Form className="create-common-funding__form">
              <ToggleButtonGroup
                className="create-common-funding__field"
                name="contributionType"
                label="Contribution type"
                styles={{ label: "create-common-funding__field-label" }}
              >
                <ToggleButton value={ContributionType.OneTime}>
                  One-time
                </ToggleButton>
                <ToggleButton value={ContributionType.Monthly}>
                  Monthly
                </ToggleButton>
              </ToggleButtonGroup>
              <CurrencyInput
                className="create-common-funding__field"
                id="minimumContribution"
                name="minimumContribution"
                label={<>Minimum <strong>{contributionType === ContributionType.OneTime ? "one-time" : "monthly"}</strong> contribution</>}
                description={`Set the minimum amount that new members will have to contribute in order to join this Common. The minimum contribution allowed by credit card is $${MIN_CONTRIBUTION_VALUE}.`}
                placeholder={`$${MIN_CONTRIBUTION_VALUE}`}
                allowDecimals={false}
                styles={{
                  label: "create-common-funding__field-label",
                  description: "create-common-funding__currency-input-description",
                  error: "create-common-funding__currency-input-error",
                }}
              />
              {contributionType === ContributionType.OneTime && (
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
