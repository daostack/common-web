import React, { FC } from "react";
import classNames from "classnames";
import decentralizedOrganizationImageSrc from "@/shared/assets/images/decentralized-organization.svg";
import decideTogetherImageSrc from "@/shared/assets/images/decide-together.svg";
import poolFundsImageSrc from "@/shared/assets/images/pool-funds.svg";
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
        descriptionClassName
      )}
    >
      {description}
    </p>
  </div>
);

const StructureInfoSection: FC = () => (
  <section className="landing-structure-info-section">
    <h2 className="landing-structure-info-section__title">
      Shape a new structure for an organization
    </h2>
    <div className="landing-structure-info-section__cards-wrapper">
      <Card
        imageSrc={poolFundsImageSrc}
        title="Pool Funds"
        description="Pool collective resources to the Common’s wallet."
        descriptionClassName="landing-structure-info-section__card-description--small"
      />
      <Card
        imageSrc={decideTogetherImageSrc}
        title="Decide Together"
        description="Propose, discuss and vote on decisions and expenses."
        descriptionClassName="landing-structure-info-section__card-description--medium"
      />
      <Card
        imageSrc={decentralizedOrganizationImageSrc}
        title="Decentralized Organization"
        description="Shape a new structure, which is collaborative, autonomous and transparent."
      />
    </div>
  </section>
);

export default StructureInfoSection;
