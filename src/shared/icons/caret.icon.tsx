import React, { FC } from "react";

interface CaretIconProps {
  className?: string;
}

const CaretIcon: FC<CaretIconProps> = ({ className }) => (
  <svg
    className={className}
    width="11"
    height="4"
    viewBox="0 0 11 4"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.33333 3.6648L10.5 0H0.5L4.66667 3.6648C5.1269 4.11174 5.8731 4.11174 6.33333 3.6648Z"
      fill="currentColor"
    />
  </svg>
);

export default CaretIcon;
