import React, { FC } from "react";

interface Edit3IconProps {
  className?: string;
}

const Edit3Icon: FC<Edit3IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="19"
      height="19"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.3 11.7602V16.2992C16.3 16.7501 16.1209 17.1825 15.8021 17.5013C15.4833 17.8201 15.0509 17.9992 14.6 17.9992H2.7C2.24913 17.9992 1.81673 17.8201 1.49792 17.5013C1.17911 17.1825 1 16.7501 1 16.2992V4.39922C1 3.94835 1.17911 3.51595 1.49792 3.19714C1.81673 2.87833 2.24913 2.69922 2.7 2.69922H7.239"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5999 1L17.9999 4.4L9.49985 12.9H6.09985V9.5L14.5999 1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Edit3Icon;
