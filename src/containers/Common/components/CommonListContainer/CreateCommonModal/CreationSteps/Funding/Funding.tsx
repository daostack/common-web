import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "../../../../../../../shared/utils";
import { ModalFooter, ModalHeaderContent } from "../../../../../../../shared/components/Modal";
import { Form, ToggleButtonGroup, ToggleButton } from "../../../../../../../shared/components/Form/Formik";
import { ContributionType } from "../../../../../../../shared/constants/contributionType";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import "./index.scss";

interface FundingProps {
  currentStep: number;
  onFinish: () => void;
}

interface FormValues {
  contributionType: ContributionType;
}

const INITIAL_VALUES: FormValues = {
  contributionType: ContributionType.OneTime,
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
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="create-common-funding__form">
              <ToggleButtonGroup
                name="contributionType"
                label="Contribution type"
              >
                <ToggleButton value={ContributionType.OneTime}>
                  One-time
                </ToggleButton>
                <ToggleButton value={ContributionType.Monthly}>
                  Monthly
                </ToggleButton>
              </ToggleButtonGroup>
              <ModalFooter sticky={!isMobileView}>
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
