import React, { FC } from "react";

interface OpenIconProps {
  className?: string;
}

export const OpenIcon: FC<OpenIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 8.83333V12.1667C11 12.5203 10.8595 12.8594 10.6095 13.1095C10.3594 13.3595 10.0203 13.5 9.66667 13.5H2.33333C1.97971 13.5 1.64057 13.3595 1.39052 13.1095C1.14048 12.8594 1 12.5203 1 12.1667V4.83333C1 4.1 1.6 3.5 2.33333 3.5H5.66667M9 1.5H13V5.5M5.66667 8.83333L12.4667 2.03333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
