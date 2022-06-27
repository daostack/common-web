import React, { FC } from "react";
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
        descriptionClassName
      )}
    >
      {description}
    </p>
  </div>
);

const CommonInfoSection: FC = () => (
  <section className="landing-common-info-section">
    <div className="landing-common-info-section__content">
      <h2 className="landing-common-info-section__title">What is Common?</h2>
      <Card
        imageSrc={commonGlobalEmpowerIconSrc}
        imageAlt="Global empower"
        description="Common empowers people around the world to catalyze social and economic change and fulfill common dreams together."
      />
      <Card
        imageSrc={commonVotingProcessIconSrc}
        imageAlt="Voting process"
        description="Common members exchange ideas, prioritize initiatives, and fund projects through a democratic voting process."
        descriptionClassName="landing-common-info-section__card-description--voting-process"
      />
      <Card
        imageSrc={commonCollaborationIconSrc}
        imageAlt="Collaboration"
        description="Common enables large groups of people to collaborate on shared agendas by pooling funds and collectively making decisions."
        descriptionClassName="landing-common-info-section__card-description--collaboration"
      />
    </div>
  </section>
);

export default CommonInfoSection;
