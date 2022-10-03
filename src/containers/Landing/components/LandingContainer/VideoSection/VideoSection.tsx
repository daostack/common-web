import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import landingVideoPosterSrc from "@/shared/assets/images/landing-video-poster.jpeg";
import landingVideoSrc from "@/shared/assets/videos/landing-video.mp4";
import { Button } from "@/shared/components";
import "./index.scss";

interface VideoSectionProps {
  onLaunchClick: () => void;
}

const VideoSection: FC<VideoSectionProps> = ({ onLaunchClick }) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "landing",
  });

  return (
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
          {t("videoSection.title.part1")}
          <br />
          {t("videoSection.title.part2")}
        </h1>
        <p className="landing-video-section__main-info-description">
          {t("videoSection.description")}
        </p>
        <Button onClick={onLaunchClick}> {t("buttons.launchCommon")}</Button>
      </div>
    </section>
  );
};

export default VideoSection;
