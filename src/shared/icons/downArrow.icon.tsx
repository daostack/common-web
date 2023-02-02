import React, { FC } from "react";

interface DownArrowIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const DownArrowIcon: FC<DownArrowIconProps> = ({
  className,
  ariaHidden = true,
}) => (
  <svg
    className={className}
    width="14"
    height="8"
    viewBox="0 0 14 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
  >
    <path
      d="M1 1L7 7L13 1"
      stroke="#001A36"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export default DownArrowIcon;
