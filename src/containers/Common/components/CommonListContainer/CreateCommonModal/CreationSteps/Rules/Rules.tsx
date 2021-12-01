import React, { useCallback, useRef, ReactElement, ReactNode } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "@/shared/utils";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Form, RulesArray, RulesArrayItem } from '@/shared/components/Form/Formik';
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import { MAX_RULE_TITLE_LENGTH } from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface RulesProps {
  currentStep: number;
  onFinish: () => void;
}

interface FormValues {
  rules: RulesArrayItem[],
}

const INITIAL_VALUES: FormValues = {
  rules: [{ title: "", description: "" }],
};

export default function Rules({ currentStep, onFinish }: RulesProps): ReactElement {
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
      <div className="create-common-rules">
        {isMobileView && progressEl}
        <Separator />
        <Formik
          initialValues={INITIAL_VALUES}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="create-common-rules__form">
              <RulesArray
                name="rules"
                values={values.rules}
                errors={errors.rules}
                touched={touched.rules}
                maxTitleLength={MAX_RULE_TITLE_LENGTH}
                itemClassName="create-common-rules__rules-array-item"
              />
              <ModalFooter sticky>
                <div className="create-common-rules__modal-footer">
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
