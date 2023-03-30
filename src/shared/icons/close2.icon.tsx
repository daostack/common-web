import React, { FC } from "react";

interface Close2IconProps {
  className?: string;
  width?: number;
  height?: number;
}

// Reference: https://www.figma.com/file/blLDX3L1CwCIAIHwrghKIQ/Common-Platform?node-id=1019%3A11097&t=2uPcQansNEngZ6FI-4
const Close2Icon: FC<Close2IconProps> = ({
  className,
  width = 14,
  height = 14,
}) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 1L1 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 1L13 13"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Close2Icon;
