import React, { FC } from "react";

interface EmojiIconProps {
  className?: string;
  size?: number;
}

const EmojiIcon: FC<EmojiIconProps> = ({ className, size = 24 }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_9264_18191)">
      <path
        d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="#8D91A9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 10H9.01"
        stroke="#8D91A9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15 10H15.01"
        stroke="#8D91A9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16 14.5C16 15.4283 15.5786 16.3185 14.8284 16.9749C14.0783 17.6313 13.0609 18 12 18C10.9391 18 9.92172 17.6313 9.17157 16.9749C8.42143 16.3185 8 15.4283 8 14.5L12 14.5H16Z"
        stroke="#8D91A9"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_9264_18191">
        <rect width={size} height={size} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default EmojiIcon;
