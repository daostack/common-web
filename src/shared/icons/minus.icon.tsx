import React, { FC } from "react";

interface MinusIconProps {
  className?: string;
}

const MinusIcon: FC<MinusIconProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.16699 10H15.8337"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MinusIcon;
