import React, { FC } from "react";

interface BoldMarkIconProps {
  className?: string;
}

const BoldMarkIcon: FC<BoldMarkIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="13"
      height="16"
      viewBox="0 0 13 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1.33398H7.66667C8.55072 1.33398 9.39857 1.68517 10.0237 2.31029C10.6488 2.93542 11 3.78326 11 4.66732C11 5.55137 10.6488 6.39922 10.0237 7.02434C9.39857 7.64946 8.55072 8.00065 7.66667 8.00065H1V1.33398Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 8H8.5C9.38405 8 10.2319 8.35119 10.857 8.97631C11.4821 9.60143 11.8333 10.4493 11.8333 11.3333C11.8333 12.2174 11.4821 13.0652 10.857 13.6904C10.2319 14.3155 9.38405 14.6667 8.5 14.6667H1V8Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BoldMarkIcon;
