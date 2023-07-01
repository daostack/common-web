import React, { FC } from "react";

interface Share2IconProps {
  className?: string;
}

const Share2Icon: FC<Share2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="20"
      height="22"
      viewBox="0 0 20 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 7C17.6569 7 19 5.65685 19 4C19 2.34315 17.6569 1 16 1C14.3431 1 13 2.34315 13 4C13 5.65685 14.3431 7 16 7Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 14C5.65685 14 7 12.6569 7 11C7 9.34315 5.65685 8 4 8C2.34315 8 1 9.34315 1 11C1 12.6569 2.34315 14 4 14Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21C17.6569 21 19 19.6569 19 18C19 16.3431 17.6569 15 16 15C14.3431 15 13 16.3431 13 18C13 19.6569 14.3431 21 16 21Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.58984 12.5098L13.4198 16.4898"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.4098 5.50977L6.58984 9.48977"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Share2Icon;
