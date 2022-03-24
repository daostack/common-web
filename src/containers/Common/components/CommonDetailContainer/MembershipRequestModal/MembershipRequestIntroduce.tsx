import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { FormikProps } from "formik/dist/types";
import { Button } from "@/shared/components";
import { Form, TextField, LinksArray } from "@/shared/components/Form/Formik";
import { ScreenSize } from "@/shared/constants";
import { CommonLink } from "@/shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { IStageProps } from "./MembershipRequestModal";
import { introduceStageSchema } from "./validationSchemas";
import "./index.scss";

interface FormValues {
  intro: string;
  links: CommonLink[];
}

const getInitialValues = (data: IStageProps["userData"]): FormValues => ({
  intro: data.intro,
  links: [{ title: "", value: "" }],
});

export default function MembershipRequestIntroduce(props: IStageProps) {
  const { userData, setUserData, common } = props;
  const screenSize = useSelector(getScreenSize());
  const isMobileView = screenSize === ScreenSize.Mobile;

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      const nextStage = common && common.rules.length > 0 ? 2 : 3;

      setUserData((nextUserData) => ({
        ...nextUserData,
        intro: values.intro,
        stage: nextStage,
      }));
    },
    [setUserData]
  );

  return (
    <div className="membership-request-content membership-request-introduce">
      <div className="sub-title">Introduce Yourself</div>
      <div className="sub-text">
        Let the Common members learn more about you and how you relate to the
        cause.
      </div>
      <Formik
        initialValues={getInitialValues(userData)}
        onSubmit={handleSubmit}
        validationSchema={introduceStageSchema}
        validateOnMount
      >
        {({ isValid }) => (
          <Form className="membership-request-introduce__form">
            <TextField
              id="intro"
              name="intro"
              label="Intro"
              placeholder="Let the Common members learn more about you and how you relate to the cause."
              isRequired
              isTextarea
              rows={5}
              styles={{
                label: "membership-request-introduce__text-field-label",
              }}
            />
            <div className="membership-request-introduce__submit-button-wrapper">
              <Button
                className="membership-request-introduce__submit-button"
                type="submit"
                disabled={!isValid}
                shouldUseFullWidth={isMobileView}
              >
                Continue
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
