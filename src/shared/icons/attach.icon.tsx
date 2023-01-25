import React, { FC } from "react";

interface AttachIconProps {
  className?: string;
}

const AttachIcon: FC<AttachIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="16"
      height="17"
      viewBox="0 0 16 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10.1624 4.4207L4.92165 9.66144C4.6009 9.9822 4.4207 10.4172 4.4207 10.8708C4.4207 11.3245 4.6009 11.7595 4.92165 12.0802C5.24241 12.401 5.67744 12.5812 6.13106 12.5812C6.58467 12.5812 7.0197 12.401 7.34046 12.0802L12.5812 6.83951C13.2227 6.198 13.5831 5.32793 13.5831 4.4207C13.5831 3.51348 13.2227 2.64341 12.5812 2.0019C11.9397 1.36039 11.0696 1 10.1624 1C9.25517 1 8.3851 1.36039 7.74359 2.0019L2.50285 7.24264C1.54059 8.2049 1 9.51001 1 10.8708C1 12.2317 1.54059 13.5368 2.50285 14.4991C3.46511 15.4613 4.77022 16.0019 6.13106 16.0019C7.4919 16.0019 8.797 15.4613 9.75926 14.4991L15 9.25831"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AttachIcon;
