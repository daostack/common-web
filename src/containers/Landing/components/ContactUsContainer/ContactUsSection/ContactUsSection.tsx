import React, { FC, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { sendEmail } from "@/containers/Landing/store/actions";
import { useNotification } from "@/shared/hooks";
import { EmailType } from "@/shared/interfaces/SendEmail";
import { ContactUsForm, ContactUsFormValues } from "../ContactUsForm";
import "./index.scss";

const ContactUsSection: FC = () => {
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useNotification();

  const handleSubmit = useCallback(
    (values: ContactUsFormValues) => {
      setIsLoading(true);
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
            } else {
              notify("The form has successfully sent!");
            }

            setIsLoading(false);
          },
        })
      );
    },
    [dispatch, notify]
  );

  return (
    <section className="contact-us-contact-us-section">
      <div className="contact-us-contact-us-section__content">
        <h2 className="contact-us-contact-us-section__title">
          We are here to walk you through it
        </h2>
        <ContactUsForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          errorText={errorText}
        />
      </div>
    </section>
  );
};

export default ContactUsSection;
