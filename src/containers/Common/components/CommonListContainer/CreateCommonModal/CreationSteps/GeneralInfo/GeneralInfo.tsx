import React, { useCallback, useRef } from "react";
import { Formik, FormikConfig } from "formik";

import { ModalFooter } from "../../../../../../../shared/components/Modal";
import { Form, TextField } from "../../../../../../../shared/components/Form";
import "./index.scss";
import { FormikProps } from 'formik/dist/types';

interface GeneralInfoProps {
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

export default function GeneralInfo({}: GeneralInfoProps) {
  const formRef = useRef<FormikProps<FormValues>>(null);

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>['onSubmit']>((values) => {
    console.log(values);
  }, []);

  return (
    <>
      <div className="create-common-general-info">
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          <Form>
            <TextField
              id="commonName"
              name="commonName"
              label="Common name"
              isRequired
            />
          </Form>
        </Formik>
      </div>
      <ModalFooter sticky>
        <div className="create-common-general-info__modal-footer">
          <button className="button-blue" onClick={handleContinueClick}>
            Continue to Funding
          </button>
        </div>
      </ModalFooter>
    </>
  );
}
