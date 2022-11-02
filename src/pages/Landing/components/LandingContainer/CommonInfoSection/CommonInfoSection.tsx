import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import commonCollaborationIconSrc from "@/shared/assets/images/common-collaboration-icon.svg";
import commonGlobalEmpowerIconSrc from "@/shared/assets/images/common-global-empower-icon.svg";
import commonVotingProcessIconSrc from "@/shared/assets/images/common-voting-process-icon.svg";
import "./index.scss";

interface CardProps {
  imageSrc: string;
  imageAlt: string;
  description: string;
  descriptionClassName?: string;
}

const Card: FC<CardProps> = ({
  imageSrc,
  imageAlt,
  description,
  descriptionClassName,
}) => (
  <div className="landing-common-info-section__card">
    <img
      className="landing-common-info-section__card-image"
      src={imageSrc}
      alt={imageAlt}
    />
    <p
      className={classNames(
        "landing-common-info-section__card-description",
        descriptionClassName,
      )}
    >
      {description}
    </p>
  </div>
);

const CommonInfoSection: FC = () => {
  const { t } = useTranslation("translation", {
    keyPrefix: "landing.commonInfoSection",
  });

  return (
    <section className="landing-common-info-section">
      <div className="landing-common-info-section__content">
        <h2 className="landing-common-info-section__title">{t("title")}</h2>
        <Card
          imageSrc={commonGlobalEmpowerIconSrc}
          imageAlt={t("card1.imageAlt")}
          description={t("card1.description")}
        />
        <Card
          imageSrc={commonVotingProcessIconSrc}
          imageAlt={t("card2.imageAlt")}
          description={t("card2.description")}
          descriptionClassName="landing-common-info-section__card-description--voting-process"
        />
        <Card
          imageSrc={commonCollaborationIconSrc}
          imageAlt={t("card3.imageAlt")}
          description={t("card3.description")}
          descriptionClassName="landing-common-info-section__card-description--collaboration"
        />
      </div>
    </section>
  );
};

export default CommonInfoSection;
