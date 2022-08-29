import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import collectiveActionImageSrc from "@/shared/assets/images/collective-action.png";
import { Button } from "@/shared/components";
import "./index.scss";

interface CollectiveActionSectionProps {
  onLaunchClick: () => void;
}

const CollectiveActionSection: FC<CollectiveActionSectionProps> = ({
  onLaunchClick,
}) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "landing",
  });
  const description = t("collectiveActionSection.description");

  return (
    <section className="landing-collective-action-section">
      <img
        className="landing-collective-action-section__image"
        src={collectiveActionImageSrc}
        alt={t("collectiveActionSection.imageAlt")}
      />
      <div className="landing-collective-action-section__overlay" />
      <div className="landing-collective-action-section__main-content">
        <h2 className="landing-collective-action-section__title">
          {t("collectiveActionSection.title")}
        </h2>
        {description && (
          <p className="landing-collective-action-section__description">
            {description}
          </p>
        )}
        <Button
          className="landing-collective-action-section__button"
          onClick={onLaunchClick}
        >
          {t("buttons.launchCommon")}
        </Button>
      </div>
    </section>
  );
};

export default CollectiveActionSection;
