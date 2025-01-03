import React, { FC, useRef } from "react";
import { useSelector } from "react-redux";
import { Formik } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button } from "@/shared/components";
import { Form, LinksArray, TextField } from "@/shared/components/Form/Formik";
import { ModalFooter } from "@/shared/components/Modal";
import { MAX_LINK_TITLE_LENGTH, ScreenSize } from "@/shared/constants";
import { getScreenSize } from "@/shared/store/selectors";
import { commonTypeText } from "@/shared/utils";
import { UpdateCommonData } from "../../../../../../interfaces";
import {
  MAX_ABOUT_LENGTH,
  MAX_COMMON_NAME_LENGTH,
  MAX_TAGLINE_LENGTH,
} from "../constants";
import { MainInfoValues } from "../types";
import validationSchema from "./validationSchema";

interface GeneralInfoProps {
  onFinish: (values: MainInfoValues) => void;
  currentData: UpdateCommonData;
  isSubCommonCreation: boolean;
}

const getInitialValues = (data: UpdateCommonData): MainInfoValues => ({
  commonName: data.name,
  tagline: data.byline || "",
  about: data.description || "",
  links: data.links?.length ? data.links : [{ title: "", value: "" }],
});

const MainInfo: FC<GeneralInfoProps> = (props) => {
  const { onFinish, currentData, isSubCommonCreation } = props;
  const formRef = useRef<FormikProps<MainInfoValues>>(null);
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleContinueClick = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  return (
    <Formik
      initialValues={getInitialValues(currentData)}
      onSubmit={onFinish}
      innerRef={formRef}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ values, errors, touched, isValid }) => (
        <Form>
          <TextField
            className="update-common-general-info__text-field"
            id="commonName"
            name="commonName"
            label={`${commonTypeText(isSubCommonCreation)} name`}
            placeholder="Save the Amazon"
            maxLength={MAX_COMMON_NAME_LENGTH}
            isRequired
          />
          <TextField
            className="update-common-general-info__text-field"
            id="tagline"
            name="tagline"
            label="Tagline"
            placeholder={`What is the ultimate goal of the ${commonTypeText(
              isSubCommonCreation,
            )}?`}
            maxLength={MAX_TAGLINE_LENGTH}
          />
          <TextField
            className="update-common-general-info__text-field"
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
            className="update-common-general-info__text-field"
            itemClassName="update-common-general-info__links-array-item"
          />
          <ModalFooter sticky>
            <div className="update-common-general-info__modal-footer">
              <Button
                onClick={handleContinueClick}
                shouldUseFullWidth={isMobileView}
                disabled={!isValid}
              >
                Continue
              </Button>
            </div>
          </ModalFooter>
        </Form>
      )}
    </Formik>
  );
};

export default MainInfo;
