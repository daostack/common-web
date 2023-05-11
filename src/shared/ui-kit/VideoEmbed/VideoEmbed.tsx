import { FC } from "react";
import React from "react";
import { formatVideoSource, isYouTubeUrl } from "../ImageGallery/utils";

/**
 * TODO: add more props to control the component
 */
interface VideoEmbedProps {
  videoSrc: string;
  className?: string;
  style?: React.CSSProperties;
}

const VideoEmbed: FC<VideoEmbedProps> = (props) => {
  const { videoSrc, className, style } = props;

  return (
    <>
      {isYouTubeUrl(videoSrc) ? (
        <iframe
          allowFullScreen
          src={formatVideoSource(videoSrc)}
          className={className}
          style={style}
        ></iframe>
      ) : (
        <video
          playsInline
          preload="auto"
          controls
          className={className}
          style={style}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </>
  );
};

export default VideoEmbed;
