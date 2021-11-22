import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "../../../../../../../shared/utils";
import { ModalFooter, ModalHeaderContent } from "../../../../../../../shared/components/Modal";
import { Form } from "../../../../../../../shared/components/Form/Formik";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
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

export default function UserAcknowledgment({ currentStep, onFinish }: UserAcknowledgmentProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const isMobileView = isMobile();

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>['onSubmit']>((values) => {
    console.log(values);
    onFinish();
  }, [onFinish]);

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
