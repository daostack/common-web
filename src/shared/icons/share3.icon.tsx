import React, { FC } from "react";

interface Share3IconProps {
  className?: string;
}

const Share3Icon: FC<Share3IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.3334 6.33333C15.8062 6.33333 17.0001 5.13943 17.0001 3.66667C17.0001 2.19391 15.8062 1 14.3334 1C12.8607 1 11.6667 2.19391 11.6667 3.66667C11.6667 5.13943 12.8607 6.33333 14.3334 6.33333Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.66667 12.556C5.13943 12.556 6.33333 11.3621 6.33333 9.88932C6.33333 8.41656 5.13943 7.22266 3.66667 7.22266C2.19391 7.22266 1 8.41656 1 9.88932C1 11.3621 2.19391 12.556 3.66667 12.556Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3334 18.7786C15.8062 18.7786 17.0001 17.5847 17.0001 16.112C17.0001 14.6392 15.8062 13.4453 14.3334 13.4453C12.8607 13.4453 11.6667 14.6392 11.6667 16.112C11.6667 17.5847 12.8607 18.7786 14.3334 18.7786Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.96875 11.2305L12.0399 14.7682"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.031 5.00977L5.96875 8.54754"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Share3Icon;
