import React, { FC } from "react";
import teamImageSrc from "@/shared/assets/images/team.png";
import "./index.scss";

interface InfoSectionProps {
  onGoBack: () => void;
}

const InfoSection: FC<InfoSectionProps> = ({ onGoBack }) => (
  <section className="contact-us-info-section">
    <img
      className="contact-us-info-section__image"
      src={teamImageSrc}
      alt="Team"
    />
    <div className="contact-us-info-section__overlay" />
    <div className="contact-us-info-section__main-content-wrapper">
      <div className="contact-us-info-section__main-content">
        <h1 className="contact-us-info-section__title">Launch a Common</h1>
        <p className="contact-us-info-section__description">
          We are looking for initiatives that are ready to launch and be our
          superusers as we design the product further.
        </p>
        <p className="contact-us-info-section__description">
          If you tick all the boxes bellow, you are the one we are looking for:
        </p>
      </div>
    </div>
  </section>
);

export default InfoSection;
