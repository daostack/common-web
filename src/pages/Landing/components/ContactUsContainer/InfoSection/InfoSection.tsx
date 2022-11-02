import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classNames from "classnames";
import teamImageSrc from "@/shared/assets/images/team.png";
import { ButtonLink } from "@/shared/components";
import CheckInCircleIcon from "@/shared/icons/checkInCircle.icon";
import LeftArrowIcon from "@/shared/icons/leftArrow.icon";
import RightArrowIcon from "@/shared/icons/rightArrow.icon";
import { selectIsRtlLanguage } from "@/shared/store/selectors";
import "./index.scss";

interface InfoSectionProps {
  onGoBack: () => void;
}

interface ListItemProps {
  isRtl: boolean;
}

const ListItem: FC<ListItemProps> = ({ isRtl, children }) => (
  <div className="contact-us-info-section__list-item">
    <CheckInCircleIcon
      className={classNames("contact-us-info-section__list-item-icon", {
        "contact-us-info-section__list-item-icon--rtl": isRtl,
      })}
    />
    {children}
  </div>
);

const InfoSection: FC<InfoSectionProps> = ({ onGoBack }) => {
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
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
            {isRtlLanguage ? (
              <RightArrowIcon className="contact-us-info-section__back-icon" />
            ) : (
              <LeftArrowIcon className="contact-us-info-section__back-icon" />
            )}
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
            <ListItem isRtl={isRtlLanguage}>{t("list.item1")}</ListItem>
            <ListItem isRtl={isRtlLanguage}>{t("list.item2")}</ListItem>
            <ListItem isRtl={isRtlLanguage}>{t("list.item3")}</ListItem>
            <ListItem isRtl={isRtlLanguage}>{t("list.item4")}</ListItem>
            <ListItem isRtl={isRtlLanguage}>{t("list.item5")}</ListItem>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
