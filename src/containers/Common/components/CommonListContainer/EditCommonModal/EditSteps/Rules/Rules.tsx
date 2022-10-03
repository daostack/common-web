import React, { useCallback, useRef, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button, Separator } from "@/shared/components";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Form, RulesArray } from "@/shared/components/Form/Formik";
import { ScreenSize } from "@/shared/constants";
import { BaseRule } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import {
  MAX_RULE_TITLE_LENGTH,
  MAX_RULE_DESCRIPTION_LENGTH,
} from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface RulesProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

interface FormValues {
  rules: BaseRule[];
}

const getInitialValues = (
  data: IntermediateCreateCommonPayload
): FormValues => ({
  rules: data.rules?.length ? data.rules : [{ title: "", definition: "" }],
});

export default function Rules({
  currentStep,
  onFinish,
  creationData,
}: RulesProps): ReactElement {
  const formRef = useRef<FormikProps<FormValues>>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleContinueClick = useCallback(() => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  }, []);

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      const rules = values.rules.filter(
        (rule) => rule.title && rule.definition
      );

      onFinish({ rules });
    },
    [onFinish]
  );

  const progressEl = (
    <Progress
      creationStep={currentStep}
    />
  );

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
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
                maxDescriptionLength={MAX_RULE_DESCRIPTION_LENGTH}
                itemClassName="create-common-rules__rules-array-item"
              />
              <ModalFooter sticky>
                <div className="create-common-rules__modal-footer">
                  <Button
                    key="rules-continue"
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={!isValid}
                  >
                    Continue to Review
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
