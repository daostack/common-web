import React, { ReactElement } from "react";

interface DollarIconProps {
  className?: string;
}

export default function DollarIcon({
  className,
}: DollarIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 14.5C11.3137 14.5 14 11.8137 14 8.5C14 5.18629 11.3137 2.5 8 2.5C4.68629 2.5 2 5.18629 2 8.5C2 11.8137 4.68629 14.5 8 14.5Z"
        stroke="#001A36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.86667 6.50006C9.7459 6.29057 9.57043 6.11787 9.35905 6.00043C9.14768 5.883 8.90834 5.82526 8.66667 5.8334H7.33333C6.97971 5.8334 6.64057 5.97387 6.39052 6.22392C6.14048 6.47397 6 6.81311 6 7.16673C6 7.52035 6.14048 7.85949 6.39052 8.10954C6.64057 8.35959 6.97971 8.50006 7.33333 8.50006H8.66667C9.02029 8.50006 9.35943 8.64054 9.60948 8.89059C9.85952 9.14064 10 9.47977 10 9.8334C10 10.187 9.85952 10.5262 9.60948 10.7762C9.35943 11.0263 9.02029 11.1667 8.66667 11.1667H7.33333C7.09166 11.1749 6.85232 11.1171 6.64095 10.9997C6.42957 10.8823 6.2541 10.7096 6.13333 10.5001"
        stroke="#001A36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11.1667V12.5M8 4.5V5.83333V4.5Z"
        stroke="#001A36"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
