import React, { FC } from "react";

interface StarIconProps {
  className?: string;
  stroke?: string;
}

const StarIcon: FC<StarIconProps> = (props) => {
  const { className, stroke = "#de189b" } = props;
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="22"
      height="21"
      viewBox="0 0 22 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.0001 16.75L4.82808 19.995L6.00708 13.122L1.00708 8.25495L7.90708 7.25495L10.9931 1.00195L14.0791 7.25495L20.9791 8.25495L15.9791 13.122L17.1581 19.995L11.0001 16.75Z"
        fill={color}
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StarIcon;
