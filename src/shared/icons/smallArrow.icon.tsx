import React, { FC } from "react";

interface SmallArrowIconProps {
  className?: string;
  ariaHidden?: boolean;
}

const SmallArrowIcon: FC<SmallArrowIconProps> = ({ className, ariaHidden }) => (
  <svg
    className={className}
    width="6"
    height="8"
    viewBox="0 0 6 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden={ariaHidden}
  >
    <path
      d="M4.8764 3.18912C5.42946 3.58825 5.42946 4.41175 4.87641 4.81088L1.58521 7.1861C0.923842 7.6634 9.76746e-08 7.19083 8.79486e-08 6.37522L3.13002e-08 1.62478C2.15742e-08 0.809174 0.923841 0.336598 1.58521 0.813896L4.8764 3.18912Z"
      fill="currentColor"
    />
  </svg>
);

export default SmallArrowIcon;
