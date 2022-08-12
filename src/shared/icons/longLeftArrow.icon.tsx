import React, { FC } from "react";

interface LongLeftArrowIconProps {
  className?: string;
}

const LongLeftArrowIcon: FC<LongLeftArrowIconProps> = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1L1 8L8 15M15 8H2H15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LongLeftArrowIcon;
