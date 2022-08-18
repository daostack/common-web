import React, { FC, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  ModalFooter,
} from "@/shared/components";
import { ScreenSize, MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import QuestionOutlineIcon from "@/shared/icons/questionOutline.icon";
import { Governance, CommonLink } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { StageName } from "../../StageName";
import { SurveyData } from "../types";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Form, LinksArray, TextField, ImageArray } from "@/shared/components/Form/Formik";
import { surveyValidationSchema } from "../validationSchema";
import { ProposalImage } from "@/shared/models/governance/proposals";
import { SURVEY_PROPOSAL_TITLE_LENGTH } from '../constants';
import "./index.scss";

interface ConfigurationProps {
  governance: Governance;
  initialData: SurveyData;
  onFinish: (data: SurveyData) => void;
}

interface FormValues {
  title: string;
  description: string;
  links: CommonLink[];
  images: ProposalImage[];
  areImagesLoading: boolean;
}

const Configuration: FC<ConfigurationProps> = (props) => {
  const { initialData, onFinish } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;
  const formRef = useRef<FormikProps<FormValues>>(null);

  const getInitialValues = (): FormValues => ({
    title: "",
    description: "",
    images: formRef.current?.values.images || [],
    links: formRef.current?.values.links || [],
    areImagesLoading: false,
  });

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      onFinish({
        ...initialData,
        ...values,
        title: values.title,
        description: values.description,
      });
    },
    [onFinish, initialData]
  );

  const handleContinueClick = () => {
    formRef.current?.submitForm();
  };

  return (
    <div className="survey-configuration">
      <StageName
        className="survey-configuration__stage-name"
        name="Survey"
        backgroundColor="light-yellow"
        icon={
          <QuestionOutlineIcon className="survey-configuration__avatar-icon" />
        }
      />
      <div className="survey-configuration__form">
        <Formik
          initialValues={getInitialValues()}
          onSubmit={handleSubmit}
          innerRef={formRef}
          validationSchema={surveyValidationSchema}
          validateOnMount
        >
          {({ values, errors, touched, isValid }) => (
            <Form>
              <TextField
                className="create-survey__text-field"
                id="title"
                name="title"
                label="Title"
                placeholder="Briefly describe your proposal"
                maxLength={SURVEY_PROPOSAL_TITLE_LENGTH}
                isRequired
              />
              <TextField
                className="create-survey__text-field"
                id="description"
                name="description"
                label="Description"
                placeholder="What exactly do you plan to do and how? How does it align with the Common's agenda and goals"
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
                className="survey-form__text-field"
                itemClassName="survey__links-array-item"
              />
              <ImageArray
                name="images"
                values={values.images}
                areImagesLoading={values.areImagesLoading}
                loadingFieldName="areImagesLoading"
              />
              <ModalFooter sticky={!isMobileView}>
                <div className="survey-configuration__modal-footer">
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
      </div>
    </div>
  );
};

export default Configuration;
