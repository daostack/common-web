import React, { FC } from "react";

interface FollowIconProps {
  className?: string;
}

const FollowIcon: FC<FollowIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="20"
      height="19"
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 1L12.781 6.634L19 7.543L14.5 11.926L15.562 18.118L10 15.193L4.438 18.118L5.5 11.926L1 7.543L7.219 6.634L10 1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FollowIcon;
