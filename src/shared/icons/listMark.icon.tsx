import React, { FC } from "react";

interface ListMarkIconProps {
  className?: string;
}

const ListMarkIcon: FC<ListMarkIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="16"
      height="12"
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.66675 1H15.5001"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66675 6H15.5001"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66675 11H15.5001"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 1H0.51"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 6H0.51"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.5 11H0.51"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ListMarkIcon;
