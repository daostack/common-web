import React, { FC } from "react";

interface Link4IconProps {
  className?: string;
}

const Link4Icon: FC<Link4IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 12L12 6"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 2.99982L8.463 2.46382C9.40081 1.52614 10.6727 0.999418 11.9989 0.999512C13.325 0.999605 14.5968 1.52651 15.5345 2.46432C16.4722 3.40212 16.9989 4.67401 16.9988 6.00017C16.9987 7.32633 16.4718 8.59815 15.534 9.53582L15 9.99982"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.0001 15L9.60314 15.534C8.65439 16.4722 7.37393 16.9984 6.03964 16.9984C4.70535 16.9984 3.42489 16.4722 2.47614 15.534C2.0085 15.0716 1.63724 14.521 1.38385 13.9141C1.13047 13.3073 1 12.6561 1 11.9985C1 11.3408 1.13047 10.6897 1.38385 10.0829C1.63724 9.47598 2.0085 8.9254 2.47614 8.463L3.00014 8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Link4Icon;
