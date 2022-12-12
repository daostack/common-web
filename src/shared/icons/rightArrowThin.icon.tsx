import React, { FC } from "react";

interface RightArrowThinIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const RightArrowThinIcon: FC<RightArrowThinIconProps> = ({
  className,
  ariaHidden = true,
}) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default RightArrowThinIcon;
