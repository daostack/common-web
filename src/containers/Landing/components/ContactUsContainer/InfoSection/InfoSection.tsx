import React, { FC } from "react";
import { useTranslation } from "react-i18next";
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

const InfoSection: FC<InfoSectionProps> = ({ onGoBack }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "contactUs.infoSection",
  });

  return (
    <section className="contact-us-info-section">
      <img
        className="contact-us-info-section__image"
        src={teamImageSrc}
        alt={t("imageAlt")}
      />
      <div className="contact-us-info-section__overlay" />
      <div className="contact-us-info-section__main-content-wrapper">
        <div className="contact-us-info-section__main-content">
          <ButtonLink
            className="contact-us-info-section__back-link"
            onClick={onGoBack}
          >
            <LeftArrowIcon />
            {t("backButton")}
          </ButtonLink>
          <h1 className="contact-us-info-section__title">{t("title")}</h1>
          <p className="contact-us-info-section__description">
            {t("description.part1")}
          </p>
          <p className="contact-us-info-section__description">
            {t("description.part2")}
          </p>
          <ul className="contact-us-info-section__list">
            <ListItem>{t("list.item1")}</ListItem>
            <ListItem>{t("list.item2")}</ListItem>
            <ListItem>{t("list.item3")}</ListItem>
            <ListItem>{t("list.item4")}</ListItem>
            <ListItem>{t("list.item5")}</ListItem>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
