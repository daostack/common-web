import React, { FC } from "react";
import { ContactUsForm } from "../ContactUsForm";
import "./index.scss";

const ContactUsSection: FC = () => (
  <section className="contact-us-contact-us-section">
    <div className="contact-us-contact-us-section__content">
      <h2 className="contact-us-contact-us-section__title">
        We are here to walk you through it
      </h2>
      <ContactUsForm />
    </div>
  </section>
);

export default ContactUsSection;
