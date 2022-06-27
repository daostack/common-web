import React, { FC } from "react";
import teamImageSrc from "@/shared/assets/images/team.png";
import { ButtonLink } from "@/shared/components";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import CheckInCircleIcon from "@/shared/icons/checkInCircle.icon";
import "./index.scss";

interface InfoSectionProps {
  onGoBack: () => void;
}

const ListItem: FC = ({ children }) => (
  <div className="contact-us-info-section__list-item">
    <CheckInCircleIcon className="contact-us-info-section__list-item-icon" />
    {children}
  </div>
);

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
        <ButtonLink
          className="contact-us-info-section__back-link"
          onClick={onGoBack}
        >
          <LeftArrowIcon />
          Back
        </ButtonLink>
        <h1 className="contact-us-info-section__title">Launch a Common</h1>
        <p className="contact-us-info-section__description">
          We are looking for initiatives that are ready to launch and be our
          superusers as we design the product further.
        </p>
        <p className="contact-us-info-section__description">
          If you tick all the boxes bellow, you are the one we are looking for:
        </p>
        <ul className="contact-us-info-section__list">
          <ListItem>
            You are a steward of a grassroots initiative/movement, with a clear
            purpose that will change the world for the better.
          </ListItem>
          <ListItem>
            You have an active and devoted core team with you, and a large
            audience-community of followers.
          </ListItem>
          <ListItem>
            You have the participatory “bug” - wanting more people to have more
            power in decision making and action.
          </ListItem>
          <ListItem>
            You wish to pool funds from your community and make decisions about
            them together.
          </ListItem>
          <ListItem>You have the courage to try something new.</ListItem>
        </ul>
      </div>
    </div>
  </section>
);

export default InfoSection;
