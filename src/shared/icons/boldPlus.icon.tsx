import React, { FC } from "react";

interface BoldPlusIconProps {
  className?: string;
}

const BoldPlusIcon: FC<BoldPlusIconProps> = ({ className }) => (
  <svg
    className={className}
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 1V9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
    <path
      d="M1 5H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
    />
  </svg>
);

export default BoldPlusIcon;
