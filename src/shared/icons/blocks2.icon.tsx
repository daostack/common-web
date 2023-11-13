import React, { FC } from "react";

interface Blocks2IconProps {
  className?: string;
}

const Blocks2Icon: FC<Blocks2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="19"
      height="18"
      viewBox="0 0 19 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9167 0.75H3.08333C2.07081 0.75 1.25 1.57081 1.25 2.58333V15.4167C1.25 16.4292 2.07081 17.25 3.08333 17.25H15.9167C16.9292 17.25 17.75 16.4292 17.75 15.4167V2.58333C17.75 1.57081 16.9292 0.75 15.9167 0.75Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.75 9H1.25M9.5 0.75V17.25"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Blocks2Icon;
