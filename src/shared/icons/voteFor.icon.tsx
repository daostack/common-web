import React, { FC } from "react";

interface VoteForIconProps {
  className?: string;
}

const VoteForIcon: FC<VoteForIconProps> = ({ className }) => (
  <svg
    className={className}
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.2222 6L9.22217 17L4.22217 12"
      stroke="#c32ea3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default VoteForIcon;
