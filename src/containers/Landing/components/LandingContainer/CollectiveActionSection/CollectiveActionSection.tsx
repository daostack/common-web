import React, { FC } from "react";
import collectiveActionImageSrc from "@/shared/assets/images/collective-action.png";
import { Button } from "@/shared/components";
import "./index.scss";

interface CollectiveActionSectionProps {
  onLaunchClick: () => void;
}

const CollectiveActionSection: FC<CollectiveActionSectionProps> = ({
  onLaunchClick,
}) => (
  <section className="landing-collective-action-section">
    <img
      className="landing-collective-action-section__image"
      src={collectiveActionImageSrc}
      alt="People together"
    />
    <div className="landing-collective-action-section__overlay" />
    <div className="landing-collective-action-section__main-content">
      <h2 className="landing-collective-action-section__title">
        Launch Collective Action. Catalyze a movement, Together.
      </h2>
      <p className="landing-collective-action-section__description">
        Common, where lead social entrepreneur change the world.
      </p>
      <Button onClick={onLaunchClick}>Launch a Common</Button>
    </div>
  </section>
);

export default CollectiveActionSection;
