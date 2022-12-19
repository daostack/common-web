import React, { FC } from "react";

interface Avatar2IconProps {
  className?: string;
}

const Avatar2Icon: FC<Avatar2IconProps> = ({ className }) => (
  <svg
    className={className}
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.82007 24.9165C6.72673 21.7998 8.42673 20.6665 10.3817 20.6665H19.6184C21.5734 20.6665 23.2734 21.7998 24.1801 24.9165"
      stroke="#D5D5E4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 16.4165C17.3472 16.4165 19.25 14.5137 19.25 12.1665C19.25 9.81929 17.3472 7.9165 15 7.9165C12.6528 7.9165 10.75 9.81929 10.75 12.1665C10.75 14.5137 12.6528 16.4165 15 16.4165Z"
      stroke="#D5D5E4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.9999 29.1668C22.824 29.1668 29.1666 22.8242 29.1666 15.0002C29.1666 7.17613 22.824 0.833496 14.9999 0.833496C7.17588 0.833496 0.833252 7.17613 0.833252 15.0002C0.833252 22.8242 7.17588 29.1668 14.9999 29.1668Z"
      stroke="#D5D5E4"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Avatar2Icon;
