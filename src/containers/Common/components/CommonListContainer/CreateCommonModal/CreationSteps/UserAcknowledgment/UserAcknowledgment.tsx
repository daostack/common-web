import React, { useCallback, useMemo, useRef, useState, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "../../../../../../../shared/utils";
import { ButtonLink } from "../../../../../../../shared/components";
import { ModalFooter, ModalHeaderContent } from "../../../../../../../shared/components/Modal";
import { Form } from "../../../../../../../shared/components/Form/Formik";
import ExplanationIcon from "../../../../../../../shared/icons/explanation.icon";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import { CheckedList } from "./CheckedList";
import validationSchema from "./validationSchema";
import "./index.scss";

interface UserAcknowledgmentProps {
  currentStep: number;
  onFinish: () => void;
}

interface FormValues {
  commonName: string;
  tagline: string;
  about: string;
}

const INITIAL_VALUES: FormValues = {
  commonName: '',
  tagline: '',
  about: '',
};

const CAUSES_TEXT = "Education, Religion, Culture, Science, Health, Welfare, Sports, Fighting corruption, Protecting democracy, Employment, and Human rights.";

export default function UserAcknowledgment({ currentStep, onFinish }: UserAcknowledgmentProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const [showCausesBox, setShowCausesBox] = useState(false);
  const isMobileView = isMobile();

  const toggleCausesBoxShowing = useCallback(() => {
    setShowCausesBox(shouldShow => !shouldShow);
  }, []);

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>['onSubmit']>((values) => {
    console.log(values);
    onFinish();
  }, [onFinish]);

  const listItems = useMemo(() => [
    "The purpose of the Common is not in violation of any law, regulation, or 3rd party rights.",
    <>The Common will be raising funds for <strong>non-profit or charitable causes only.</strong> The common is not intended for commercial or for-profit purposes.</>,
    "All Commons and their members must comply with applicable financial and tax obligations.",
    <>
      The Common will solely promote one or more of the following <ButtonLink className="create-common-user-acknowledgment__causes-link" onClick={toggleCausesBoxShowing}>Causes<ExplanationIcon className="create-common-user-acknowledgment__causes-icon" /></ButtonLink>.
    </>,
  ], [toggleCausesBoxShowing]);

  const headerEl = (
    <>
      <img
        className="create-common-user-acknowledgment__header-image"
        src="/assets/images/common-creation-user-acknowledgment.svg"
        alt="User Acknowledgment"
      />
      <Progress creationStep={currentStep} />
    </>
  );

  return (
    <>
      {!isMobileView && (
        <ModalHeaderContent>
          {headerEl}
        </ModalHeaderContent>
      )}
      <div className="create-common-user-acknowledgment">
        {isMobileView && headerEl}
        <Separator />
        <CheckedList items={listItems} />
        {showCausesBox && (
          <div className="create-common-user-acknowledgment__causes-box">
            {CAUSES_TEXT}
          </div>
        )}
        {/*<ModalFooter sticky={!isMobileView}>*/}
        {/*  <div className="create-common-user-acknowledgment__modal-footer">*/}
        {/*    <Formik*/}
        {/*      initialValues={INITIAL_VALUES}*/}
        {/*      onSubmit={handleSubmit}*/}
        {/*      innerRef={formRef}*/}
        {/*      validationSchema={validationSchema}*/}
        {/*      validateOnMount*/}
        {/*    >*/}
        {/*      {({ values, errors, touched, isValid }) => (*/}
        {/*        <Form>*/}
        {/*          <button*/}
        {/*            className="button-blue"*/}
        {/*            onClick={handleContinueClick}*/}
        {/*            disabled={!isValid}*/}
        {/*          >*/}
        {/*            Continue to Funding*/}
        {/*          </button>*/}
        {/*        </Form>*/}
        {/*      )}*/}
        {/*    </Formik>*/}
        {/*  </div>*/}
        {/*</ModalFooter>*/}
      </div>
    </>
  );
}
