import React, { FC } from "react";

interface UnpinIconProps {
  className?: string;
}

export const UnpinIcon: FC<UnpinIconProps> = ({ className }) => {
  const color = "currentColor";

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
        d="M1 1L19 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 2.5L9.751 5.749M7.181 7.182L5 8L3.5 9.5L10.5 16.5L12 15L12.82 12.814M14.25 10.251L17.5 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 13L2.5 17.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 2L18 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
