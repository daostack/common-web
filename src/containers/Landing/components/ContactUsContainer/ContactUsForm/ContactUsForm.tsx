import React, { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, FormikConfig } from "formik";
import { sendEmail } from "@/containers/Landing/store/actions";
import { Button, Loader } from "@/shared/components";
import { ErrorText } from "@/shared/components/Form";
import { Form, TextField } from "@/shared/components/Form/Formik";
import { SUPPORT_EMAIL } from "@/shared/constants";
import { EmailType } from "@/shared/interfaces/SendEmail";
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
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState("");

  const handleSubmit = useCallback<FormikConfig<FormValues>["onSubmit"]>(
    (values, { setSubmitting }) => {
      setSubmitting(true);
      setErrorText("");

      const description = [
        values.description,
        `Common title: ${values.commonTitle}`,
        `Residence: ${values.residence}`,
        `Phone number: ${values.phoneNumber}`,
      ].join("\n");

      dispatch(
        sendEmail.request({
          payload: {
            senderEmail: values.email,
            senderName: values.name,
            type: EmailType.ContactUsAdmin,
            text: description,
          },
          callback: (error) => {
            if (error) {
              setErrorText(error?.message ?? "Something went wrong");
            }

            setSubmitting(false);
          },
        })
      );
    },
    [dispatch]
  );

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      validateOnMount
    >
      {({ isSubmitting }) => (
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
          {isSubmitting && (
            <div className="contact-us-contact-us-form__loader">
              <Loader />
            </div>
          )}
          {!isSubmitting && (
            <Button
              className="contact-us-contact-us-form__submit-button"
              type="submit"
              disabled={isSubmitting}
              shouldUseFullWidth
            >
              Send
            </Button>
          )}
          {errorText && (
            <ErrorText className="contact-us-contact-us-form__error">
              {errorText}
            </ErrorText>
          )}
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
      )}
    </Formik>
  );
};

export default ContactUsForm;
