import React, { FC } from "react";

interface InfoIconProps {
  className?: string;
}

const InfoIcon: FC<InfoIconProps> = ({ className }) => (
  <svg
    className={className}
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 1.66663H3.00002C1.9875 1.66663 1.16669 2.48744 1.16669 3.49996V14.5C1.16669 15.5125 1.9875 16.3333 3.00002 16.3333H14C15.0125 16.3333 15.8334 15.5125 15.8334 14.5V3.49996C15.8334 2.48744 15.0125 1.66663 14 1.66663Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.5 5.33337H8.50917"
      stroke="#EEEEEE"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.58331 9H8.49998V12.6667H9.41665"
      stroke="#EEEEEE"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InfoIcon;
