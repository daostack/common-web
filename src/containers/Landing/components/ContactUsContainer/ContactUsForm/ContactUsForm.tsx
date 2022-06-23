import React, { FC, useCallback } from "react";
import { Formik, FormikConfig } from "formik";
import { Button } from "@/shared/components";
import { Form, TextField } from "@/shared/components/Form/Formik";
import { SUPPORT_EMAIL } from "@/shared/constants";
import validationSchema from "./validationSchema";
import "./index.scss";

interface FormValues {
  name: string;
  commonTitle: string;
  description: string;
  residence: string;
  email: string;
  phoneNumber: string;
}

const INITIAL_VALUES: FormValues = {
  name: "",
  commonTitle: "",
  description: "",
  residence: "",
  email: "",
  phoneNumber: "",
};

const ContactUsForm: FC = () => {
  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values) => {},
    []
  );

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      <Form className="contact-us-contact-us-form">
        <TextField
          className="contact-us-contact-us-form__text-field"
          id="userName"
          name="name"
          label="Your name"
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
          label="What is the title of the Common you want to launch?"
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
          label="Please tell us a bit about the initiative and the people behind it"
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
          label="Where are you from?"
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
          label="Email"
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
          label="Phone number"
          placeholder="+972-"
          styles={{
            label: "contact-us-contact-us-form__label",
            input: {
              default: "contact-us-contact-us-form__input",
            },
          }}
        />
        <Button
          className="contact-us-contact-us-form__submit-button"
          type="submit"
          shouldUseFullWidth
        >
          Send
        </Button>
        <span className="contact-us-contact-us-form__support-email-wrapper">
          Contact us at:{" "}
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
