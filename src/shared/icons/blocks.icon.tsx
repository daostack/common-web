import React, { FC } from "react";

interface BlocksIconProps {
  className?: string;
}

const BlocksIcon: FC<BlocksIconProps> = ({ className }) => {
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
      <rect
        x="0.5"
        y="0.5"
        width="5.66667"
        height="8.33333"
        rx="0.5"
        stroke={color}
      />
      <rect
        x="0.5"
        y="11.166"
        width="5.66667"
        height="6.33333"
        rx="0.5"
        stroke={color}
      />
      <rect
        x="8.5"
        y="0.5"
        width="9"
        height="4.33333"
        rx="0.5"
        stroke={color}
      />
      <rect
        x="8.5"
        y="7.16602"
        width="9"
        height="10.3333"
        rx="0.5"
        stroke={color}
      />
    </svg>
  );
};

export default BlocksIcon;
