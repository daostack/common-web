import React from "react";
import { useHistory } from "react-router";
import landingVideoPosterSrc from "@/shared/assets/images/landing-video-poster.jpeg";
import landingVideoSrc from "@/shared/assets/videos/landing-video.mp4";
import { Button } from "@/shared/components";
import { ROUTE_PATHS } from "@/shared/constants";
import {
  CommonInfoSection,
  ImagineSection,
  StructureInfoSection,
} from "../../components/LandingContainer";
import "./index.scss";

const LandingContainer = () => {
  const history = useHistory();

  const moveToContactUsPage = () => {
    history.push(ROUTE_PATHS.CONTACT_US);
  };

  return (
    <div className="landing">
      <section className="landing__main-info-wrapper">
        <div className="landing__video-wrapper">
          <video
            className="landing__video"
            autoPlay
            loop
            muted
            playsInline
            poster={landingVideoPosterSrc}
            preload="auto"
          >
            <source src={landingVideoSrc} type="video/mp4" />
          </video>
        </div>
        <div className="landing__main-info">
          <h1 className="landing__main-info-title">
            Launch Collective Action.
            <br />
            Catalyze a movement, Together.
          </h1>
          <p className="landing__main-info-description">
            Common, where leading social entrepreneurs change the world.
          </p>
          <Button onClick={moveToContactUsPage}>Launch a Common</Button>
        </div>
      </section>
      <StructureInfoSection />
      <CommonInfoSection />
      <ImagineSection />
    </div>
  );
};

export default LandingContainer;
