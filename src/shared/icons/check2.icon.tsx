import React, { FC } from "react";

interface Check2IconProps {
  className?: string;
}

const Check2Icon: FC<Check2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 4.5L6.75 12.75L3 9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Check2Icon;
