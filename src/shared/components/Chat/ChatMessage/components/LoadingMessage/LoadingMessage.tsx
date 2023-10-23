import React from "react";
import ContentLoader from "react-content-loader";

interface LoadingMessageProps {
  backgroundColor: string;
}

const LoadingMessage = (props: LoadingMessageProps) => {
  return (
    <ContentLoader
      speed={2}
      width="100%"
      height={22}
      viewBox="0 0 296 22"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="0" y="0" rx="4" ry="4" width="100%" height="22" />
    </ContentLoader>
  );
};

export default LoadingMessage;
