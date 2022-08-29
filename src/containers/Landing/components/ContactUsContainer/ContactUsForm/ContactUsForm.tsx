import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import { Button, Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Form, TextField } from "@/shared/components/Form/Formik";
import { SUPPORT_EMAIL } from "@/shared/constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface ContactUsFormProps {
  onSubmit: (values: ContactUsFormValues) => void;
  isLoading?: boolean;
  errorText?: string;
}

export interface ContactUsFormValues {
  name: string;
  commonTitle: string;
  description: string;
  residence: string;
  email: string;
  phoneNumber: string;
}

const INITIAL_VALUES: ContactUsFormValues = {
  name: "",
  commonTitle: "",
  description: "",
  residence: "",
  email: "",
  phoneNumber: "",
};

const ContactUsForm: FC<ContactUsFormProps> = (props) => {
  const { onSubmit, isLoading = false, errorText } = props;
  const { t } = useTranslation("translation", {
    keyPrefix: "contactUs.contactUsSection.form",
  });

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      <Form className="contact-us-contact-us-form">
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="userName"
          name="name"
          label={t("nameFieldLabel")}
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="commonTitle"
          name="commonTitle"
          label={t("commonTitleLabel")}
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="description"
          name="description"
          label={t("descriptionLabel")}
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default:
                "contact-us-contact-us-form__input contact-us-contact-us-form__textarea",
            },
          }}
          isTextarea
        />
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="residence"
          name="residence"
          label={t("residenceLabel")}
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="email"
          name="email"
          label={t("emailLabel")}
          placeholder="example@email.com"
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="phoneNumber"
          name="phoneNumber"
          label={t("phoneNumberLabel")}
          placeholder="+972-"
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        {isLoading && (
          <div className="contact-us-contact-us-form__loader">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <Button
            className="contact-us-contact-us-form__submit-button"
            type="submit"
            shouldUseFullWidth
          >
            {t("sendButton")}
          </Button>
        )}
        {errorText && (
          <ErrorText className="contact-us-contact-us-form__error">
            {errorText}
          </ErrorText>
        )}
        <span className="contact-us-contact-us-form__support-email-wrapper">
          {t("contactUsHint")}{" "}
          <a
            className="contact-us-contact-us-form__support-email"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </a>
        </span>
      </Form>
    </Formik>
  );
};

export default ContactUsForm;
