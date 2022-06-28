import React, { FC } from "react";
import landingVideoPosterSrc from "@/shared/assets/images/landing-video-poster.jpeg";
import landingVideoSrc from "@/shared/assets/videos/landing-video.mp4";
import { Button } from "@/shared/components";
import "./index.scss";

interface VideoSectionProps {
  onLaunchClick: () => void;
}

const VideoSection: FC<VideoSectionProps> = ({ onLaunchClick }) => (
  <section className="landing-video-section">
    <div className="landing-video-section__video-wrapper">
      <video
        className="landing-video-section__video"
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
    <div className="landing-video-section__main-info">
      <h1 className="landing-video-section__main-info-title">
        Launch Collective Action.
        <br />
        Catalyze a movement, Together.
      </h1>
      <p className="landing-video-section__main-info-description">
        Common, where leading social entrepreneurs change the world.
      </p>
      <Button onClick={onLaunchClick}>Launch a Common</Button>
    </div>
  </section>
);

export default VideoSection;
