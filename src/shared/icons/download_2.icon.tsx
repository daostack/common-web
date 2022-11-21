import React, { ReactElement } from "react";

interface DownloadIconProps {
  className?: string;
}

export default function DownloadIcon({
  className,
}: DownloadIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_3990_41755)">
        <path
          d="M2.66667 11.8333V13.1667C2.66667 13.5203 2.80714 13.8594 3.05719 14.1095C3.30724 14.3595 3.64638 14.5 4 14.5H12C12.3536 14.5 12.6928 14.3595 12.9428 14.1095C13.1929 13.8594 13.3333 13.5203 13.3333 13.1667V11.8333"
          stroke="#5666F5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M4.66667 7.83333L8 11.1667L11.3333 7.83333"
          stroke="#5666F5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8 3.16667V11.1667"
          stroke="#5666F5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_3990_41755">
          <rect
            width="16"
            height="16"
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
