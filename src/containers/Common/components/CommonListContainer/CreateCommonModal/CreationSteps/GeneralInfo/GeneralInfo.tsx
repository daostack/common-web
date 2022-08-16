import React, { useCallback, useRef, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button, Separator } from "@/shared/components";
import { ModalFooter, ModalHeaderContent } from "@/shared/components/Modal";
import { Form, TextField, LinksArray } from "@/shared/components/Form/Formik";
import { ScreenSize, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import { CommonLink } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { IntermediateCreateCommonPayload } from "../../../../../interfaces";
import { Progress } from "../Progress";
import {
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
  MAX_ABOUT_LENGTH,
} from "./constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface GeneralInfoProps {
  currentStep: number;
  onFinish: (data: Partial<IntermediateCreateCommonPayload>) => void;
  creationData: IntermediateCreateCommonPayload;
}

interface FormValues {
  commonName: string;
  tagline: string;
  about: string;
  links: CommonLink[];
}

const getInitialValues = (
  data: IntermediateCreateCommonPayload
): FormValues => ({
  commonName: data.name,
  tagline: data.byline || "",
  about: data.description || "",
  links: data.links?.length ? data.links : [{ title: "", value: "" }],
});

export default function GeneralInfo(props: GeneralInfoProps): ReactElement {
  const { currentStep, onFinish, creationData } = props;
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
      const links = values.links.filter((link) => link.title && link.value);

      onFinish({
        name: values.commonName,
        byline: values.tagline,
        description: values.about,
        links,
      });
    },
    [onFinish]
  );

  const progressEl = <Progress creationStep={currentStep} />;

  return (
    <>
      {!isMobileView && <ModalHeaderContent>{progressEl}</ModalHeaderContent>}
      <div className="create-common-general-info">
        {isMobileView && progressEl}
        <Separator className="create-common-general-info__separator" />
        <Formik
          initialValues={getInitialValues(creationData)}
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
                placeholder="Save the Amazon"
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
                rows={isMobileView ? 4 : 3}
                isTextarea
                isRequired
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
                  <Button
                    onClick={handleContinueClick}
                    shouldUseFullWidth={isMobileView}
                    disabled={!isValid}
                  >
                    Continue to Acknowledgment
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
