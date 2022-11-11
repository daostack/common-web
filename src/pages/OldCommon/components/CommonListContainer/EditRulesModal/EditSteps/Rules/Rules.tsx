import React, { useCallback, useRef, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import {
  differenceBy,
  differenceWith,
  intersectionBy,
  isEmpty,
  isEqual,
} from "lodash";
import { Button, Separator } from "@/shared/components";
import { Form, RulesArray } from "@/shared/components/Form/Formik";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { ScreenSize } from "@/shared/constants";
import { BaseRule, Governance, UnstructuredRules } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { UpdateGovernanceRulesData } from "../../../../../interfaces";
import { Progress } from "../Progress";
import {
  MAX_RULE_TITLE_LENGTH,
  MAX_RULE_DESCRIPTION_LENGTH,
} from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface RulesProps {
  currentStep: number;
  onFinish: (data: Partial<UpdateGovernanceRulesData>) => void;
  governance: Governance | undefined;
  currentData: UpdateGovernanceRulesData;
  initialRules: UnstructuredRules;
}

interface FormValues {
  rules: BaseRule[];
}

const getInitialValues = (data: UpdateGovernanceRulesData): FormValues => ({
  rules: data.allRules?.length
    ? data.allRules
    : [{ title: "", definition: "" }],
});

export default function Rules({
  currentStep,
  onFinish,
  currentData,
  initialRules,
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
      const governanceRules = (values.rules as UnstructuredRules).filter(
        (rule) => rule.title && rule.definition && rule?.id,
      ) as UnstructuredRules;

      const deletedRules = differenceBy(initialRules, governanceRules, "id");
      const filteredInitialRules = intersectionBy(
        initialRules,
        governanceRules,
        "id",
      );
      const changes = differenceWith(
        governanceRules,
        filteredInitialRules,
        isEqual,
      );

      const newRules = (values.rules as UnstructuredRules).filter(
        (rule) => rule.title && rule.definition && !rule?.id,
      ) as UnstructuredRules;

      onFinish({
        changes: isEmpty(changes)
          ? governanceRules.map(({ id }) => ({ id }))
          : changes,
        new: newRules,
        remove: deletedRules.map(({ id }) => id).filter(Boolean),
        allRules: values.rules,
      });
    },
    [onFinish],
  );

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="update-rules">
        {isMobileView && progressEl}
        <Separator className="update-rules__separator" />
        <Formik
          initialValues={getInitialValues(currentData)}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form className="update-rules__form">
              <RulesArray
                title="Rules of conduct"
                description="Use rules to set the tone for your Common‘s discussions. (No advertising and spam, accepted language, etc.)"
                name="rules"
                values={values.rules}
                errors={errors.rules}
                touched={touched.rules}
                maxTitleLength={MAX_RULE_TITLE_LENGTH}
                maxDescriptionLength={MAX_RULE_DESCRIPTION_LENGTH}
                itemClassName="update-rules__rules-array-item"
              />
              <ModalFooter sticky>
                <div className="update-rules__modal-footer">
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
