import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import classNames from "classnames";
import decentralizedOrganizationImageSrc from "@/shared/assets/images/decentralized-organization.svg";
import decideTogetherImageSrc from "@/shared/assets/images/decide-together.svg";
import poolFundsImageSrc from "@/shared/assets/images/pool-funds.svg";
import { Language } from "@/shared/constants";
import { selectIsRtlLanguage, selectLanguage } from "@/shared/store/selectors";
import "./index.scss";

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
  descriptionClassName?: string;
}

const Card: FC<CardProps> = ({
  imageSrc,
  title,
  description,
  descriptionClassName,
}) => (
  <div className="landing-structure-info-section__card">
    <img
      className="landing-structure-info-section__card-image"
      src={imageSrc}
      alt={title}
    />
    <h3 className="landing-structure-info-section__card-title">{title}</h3>
    <p
      className={classNames(
        "landing-structure-info-section__card-description",
        descriptionClassName,
      )}
    >
      {description}
    </p>
  </div>
);

const StructureInfoSection: FC = () => {
  const language = useSelector(selectLanguage());
  const isRtlLanguage = useSelector(selectIsRtlLanguage());
  const { t } = useTranslation("translation", {
    keyPrefix: "landing.structureInfoSection",
  });

  return (
    <section className="landing-structure-info-section">
      <h2
        className={classNames("landing-structure-info-section__title", {
          "landing-structure-info-section__title--hebrew":
            language === Language.Hebrew,
        })}
      >
        {t("title")}
      </h2>
      <div
        className={classNames("landing-structure-info-section__cards-wrapper", {
          "landing-structure-info-section__cards-wrapper--rtl": isRtlLanguage,
        })}
      >
        <Card
          imageSrc={poolFundsImageSrc}
          title={t("card1.title")}
          description={t("card1.description")}
          descriptionClassName="landing-structure-info-section__card-description--small"
        />
        <Card
          imageSrc={decideTogetherImageSrc}
          title={t("card2.title")}
          description={t("card2.description")}
          descriptionClassName="landing-structure-info-section__card-description--medium"
        />
        <Card
          imageSrc={decentralizedOrganizationImageSrc}
          title={t("card3.title")}
          description={t("card3.description")}
        />
      </div>
    </section>
  );
};

export default StructureInfoSection;
