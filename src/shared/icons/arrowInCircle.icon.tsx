import React, { FC } from "react";

interface ArrowInCircleIconProps {
  className?: string;
}

const ArrowInCircleIcon: FC<ArrowInCircleIconProps> = ({ className }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
    <path
      d="M6 9.75L12 15.75L18 9.75"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowInCircleIcon;
