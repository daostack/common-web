import React, { FC } from "react";

interface IndentRightMarkIconProps {
  className?: string;
}

const IndentRightMarkIcon: FC<IndentRightMarkIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="19"
      height="14"
      viewBox="0 0 19 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1H9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 7H9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 13H9"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 4L12 7L15 10M18 7L12.4286 7L18 7Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IndentRightMarkIcon;
