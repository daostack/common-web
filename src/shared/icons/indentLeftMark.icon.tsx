import React, { FC } from "react";

interface IndentLeftMarkIconProps {
  className?: string;
}

const IndentLeftMarkIcon: FC<IndentLeftMarkIconProps> = ({ className }) => {
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
        d="M10 1H18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 7H18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13H18"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 10L7 7L4 4M1 7L6.57143 7L1 7Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IndentLeftMarkIcon;
