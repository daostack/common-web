import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { isMobile } from "@/shared/utils";
import { Separator } from "@/shared/components";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Form, RulesArray } from "@/shared/components/Form/Formik";
import { CommonRule } from "@/shared/models";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import { MAX_RULE_TITLE_LENGTH } from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface RulesProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

interface FormValues {
  rules: CommonRule[];
}

const getInitialValues = (
  data: IntermediateCreateCommonPayload
): FormValues => ({
  rules: data.rules || [{ title: "", value: "" }],
});

export default function Rules({ currentStep, onFinish, creationData }: RulesProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const isMobileView = isMobile();

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>((values) => {
    onFinish({ rules: values.rules });
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
        <Separator className="create-common-rules__separator" />
        <Formik
          initialValues={getInitialValues(creationData)}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="create-common-rules__form">
              <RulesArray
                title="Rules of conduct"
                description="Use rules to set the tone for your Common‘s discussions. (No advertising and spam, accepted language, etc.)"
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
                    key="rules-continue"
                    className="button-blue"
                    onClick={handleContinueClick}
                    disabled={!isValid}
                  >
                    Continue to Review
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
