import React, { FC } from "react";

interface RTLDirectionMarkIconProps {
  className?: string;
}

const RTLDirectionMarkIcon: FC<RTLDirectionMarkIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="16"
      height="19"
      viewBox="0 0 16 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1H5.5C4.57174 1 3.6815 1.36875 3.02513 2.02513C2.36875 2.6815 2 3.57174 2 4.5C2 5.42826 2.36875 6.3185 3.02513 6.97487C3.6815 7.63125 4.57174 8 5.5 8H6"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12V1"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 12V1"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 16H15"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 18L1 16L3 14"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RTLDirectionMarkIcon;
