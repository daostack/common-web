import React, { ReactElement } from "react";

interface SendIconProps {
  className?: string;
}

export default function SendIcon({ className }: SendIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_6449_21119)">
        <path
          d="M5.23806 12.1603H20.7944"
          stroke="#7786FF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M20.7944 12.1604L3.4703 20.2921C3.37157 20.3288 3.2644 20.3363 3.1615 20.3139C3.05861 20.2914 2.96432 20.2399 2.88985 20.1654C2.81538 20.091 2.76386 19.9967 2.74141 19.8938C2.71895 19.7909 2.72651 19.6837 2.76319 19.585L5.23806 12.1604L2.76319 4.73576C2.72651 4.63703 2.71895 4.52986 2.74141 4.42696C2.76386 4.32407 2.81538 4.22978 2.88985 4.15531C2.96432 4.08084 3.05861 4.02932 3.1615 4.00687C3.26439 3.98441 3.37157 3.99197 3.4703 4.02865L20.7944 12.1604Z"
          stroke="#7786FF"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_6449_21119">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
