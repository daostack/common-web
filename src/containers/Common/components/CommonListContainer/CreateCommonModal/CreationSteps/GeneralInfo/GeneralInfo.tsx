import React, { useCallback, useRef, ReactElement } from "react";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";

import { isMobile } from "../../../../../../../shared/utils";
import { ModalFooter, ModalHeaderContent } from "../../../../../../../shared/components/Modal";
import { Form, TextField, LinksArray, LinksArrayItem } from "../../../../../../../shared/components/Form";
import { Separator } from "../../Separator";
import { Progress } from "../Progress";
import {
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
  MAX_ABOUT_LENGTH,
  MAX_LINK_TITLE_LENGTH,
} from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface GeneralInfoProps {
  currentStep: number;
  onFinish: () => void;
}

interface FormValues {
  commonName: string;
  tagline: string;
  about: string;
  links: LinksArrayItem[];
}

const INITIAL_VALUES: FormValues = {
  commonName: '',
  tagline: '',
  about: '',
  links: [{ title: '', link: '' }],
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
          validationSchema={validationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <TextField
                className="create-common-general-info__text-field"
                id="commonName"
                name="commonName"
                label="Common name"
                placeholder="Ashley Johnson"
                maxLength={MAX_COMMON_NAME_LENGTH}
                isRequired
              />
              <TextField
                className="create-common-general-info__text-field"
                id="tagline"
                name="tagline"
                label="Tagline"
                placeholder="What is the ultimate goal of the Common?"
                maxLength={MAX_TAGLINE_LENGTH}
              />
              <TextField
                className="create-common-general-info__text-field"
                id="about"
                name="about"
                label="About"
                placeholder="Describe your cause and let others know why they should join you. What makes you passionate about it? What does success look like?"
                maxLength={MAX_ABOUT_LENGTH}
                shouldDisplayCount={!isMobileView}
                rows={isMobileView ? 4 : 3}
                isTextarea
              />
              <LinksArray
                name="links"
                values={values.links}
                errors={errors.links}
                touched={touched.links}
                maxTitleLength={MAX_LINK_TITLE_LENGTH}
                className="create-common-general-info__text-field"
                itemClassName="create-common-general-info__links-array-item"
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="create-common-general-info__modal-footer">
                  <button
                    className="button-blue"
                    onClick={handleContinueClick}
                    disabled={!isValid}
                  >
                    Continue to Funding
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
