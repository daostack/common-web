import React, { useCallback } from "react";
import { Formik, FormikConfig } from "formik";
import { Form, TextField, LinksArray } from "@/shared/components/Form/Formik";
import { MAX_LINK_TITLE_LENGTH } from "@/shared/constants";
import { CommonLink } from "@/shared/models";
import { Button, ButtonVariant } from "@/shared/ui-kit";
import { parseLinksForSubmission } from "@/shared/utils";
import { IStageProps } from "./MembershipRequestModal";
import { MembershipRequestStage } from "./constants";
import { shouldShowPaymentStep, shouldShowRulesStep } from "./helpers";
import { introduceStageSchema } from "./validationSchemas";
import "./index.scss";

interface FormValues {
  intro: string;
  links: CommonLink[];
}

const getInitialValues = (data: IStageProps["userData"]): FormValues => ({
  intro: data.intro,
  links: data.links?.length ? data.links : [{ title: "", value: "" }],
});

export default function MembershipRequestIntroduce(props: IStageProps) {
  const { userData, setUserData, governance } = props;

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {
      const links = parseLinksForSubmission(values.links);
      let nextStage: MembershipRequestStage;

      if (shouldShowRulesStep(governance)) {
        nextStage = MembershipRequestStage.Rules;
      } else {
        nextStage = shouldShowPaymentStep(governance)
          ? MembershipRequestStage.Payment
          : MembershipRequestStage.Creating;
      }

      setUserData((nextUserData) => ({
        ...nextUserData,
        links,
        intro: values.intro,
        stage: nextStage,
      }));
    },
    [setUserData, governance],
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
        {({ values, errors, touched, isValid }) => (
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
                label: "membership-request-introduce__field-label",
              }}
            />
            <LinksArray
              name="links"
              values={values.links}
              errors={errors.links}
              touched={touched.links}
              title="Links"
              hint=""
              maxTitleLength={MAX_LINK_TITLE_LENGTH}
              className="membership-request-introduce__links-array"
              itemClassName="membership-request-introduce__links-array-item"
              labelClassName="membership-request-introduce__field-label"
            />
            <div className="membership-request-introduce__submit-button-wrapper">
              <Button
                className="membership-request-introduce__submit-button"
                type="submit"
                disabled={!isValid}
                variant={ButtonVariant.PrimaryPink}
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
