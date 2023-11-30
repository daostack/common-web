import React, { ReactElement } from "react";

const BASE_WIDTH = 66;
const BASE_HEIGHT = 78;
const HEIGHT_COEFFICIENT = BASE_HEIGHT / BASE_WIDTH;

interface GalleryIconProps {
  color?: string;
  className?: string;
  size?: number;
}

export default function FileIcon({
  color = "currentColor",
  size = BASE_WIDTH,
  className,
}: GalleryIconProps): ReactElement {
  return (
    <svg
      className={className}
      width={size}
      height={size * HEIGHT_COEFFICIENT}
      viewBox="0 0 66 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M38.8633 2V18.3843C38.8633 19.4706 39.2948 20.5124 40.063 21.2806C40.8312 22.0488 41.873 22.4803 42.9593 22.4803H59.3436"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M51.1528 75.7291H10.1921C8.01944 75.7291 5.93574 74.866 4.39942 73.3297C2.8631 71.7934 2 69.7097 2 67.537V10.1921C2 8.01944 2.8631 5.93574 4.39942 4.39942C5.93574 2.8631 8.01944 2 10.1921 2H38.8646L59.3449 22.4803V67.537C59.3449 69.7097 58.4818 71.7934 56.9455 73.3297C55.4092 74.866 53.3255 75.7291 51.1528 75.7291Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3828 26.5762H22.4789"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3828 42.9609H42.9592"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3828 59.6016H26.0629"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
