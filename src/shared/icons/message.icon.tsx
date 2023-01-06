import React, { FC } from "react";

interface MessageIconProps {
  className?: string;
}

const MessageIcon: FC<MessageIconProps> = ({ className }) => {
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
        d="M1 17V4C1 3.20435 1.31607 2.44129 1.87868 1.87868C2.44129 1.31607 3.20435 1 4 1H14C14.7956 1 15.5587 1.31607 16.1213 1.87868C16.6839 2.44129 17 3.20435 17 4V10C17 10.7956 16.6839 11.5587 16.1213 12.1213C15.5587 12.6839 14.7956 13 14 13H5L1 17Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 7V7.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 7V7.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 7V7.01"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MessageIcon;
