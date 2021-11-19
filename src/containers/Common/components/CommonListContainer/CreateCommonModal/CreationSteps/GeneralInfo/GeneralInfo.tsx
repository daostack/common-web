import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "../../../../../../../shared/utils";
import { ModalFooter, ModalHeaderContent } from "../../../../../../../shared/components/Modal";
import { Form, TextField } from "../../../../../../../shared/components/Form";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import "./index.scss";

interface GeneralInfoProps {
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

export default function GeneralInfo({ currentStep, onFinish }: GeneralInfoProps): ReactElement {
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

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <>
      {!isMobileView && (
        <ModalHeaderContent>
          {progressEl}
        </ModalHeaderContent>
      )}
      <div className="create-common-general-info">
        {isMobileView && progressEl}
        <Separator />
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          <Form>
            <TextField
              className="create-common-general-info__text-field"
              id="commonName"
              name="commonName"
              label="Common name"
              placeholder="Ashley Johnson"
              maxLength={49}
              isRequired
            />
            <TextField
              className="create-common-general-info__text-field"
              id="tagline"
              name="tagline"
              label="Tagline"
              placeholder="What is the ultimate goal of the Common?"
              maxLength={89}
            />
            <TextField
              className="create-common-general-info__text-field"
              as="textarea"
              id="about"
              name="about"
              label="About"
              placeholder="Describe your cause and let others know why they should join you. What makes you passionate about it? What does success look like?"
              maxLength={49}
              rows={isMobileView ? 4 : 3}
            />
          </Form>
        </Formik>
      </div>
      <ModalFooter sticky={!isMobileView}>
        <div className="create-common-general-info__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            Continue to Funding
          </button>
        </div>
      </ModalFooter>
    </>
  );
}
