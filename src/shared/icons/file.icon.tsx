import React, { ReactElement } from "react";

interface GalleryIconProps {
  size?: number;
  className?: string;
}

export default function FileIcon({
  size = 100,
  className,
}: GalleryIconProps): ReactElement {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M74.668 16V37.3333C74.668 38.7478 75.2299 40.1044 76.2301 41.1046C77.2303 42.1048 78.5868 42.6667 80.0013 42.6667H101.335"
        stroke="#2E3452"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M90.668 112H37.3346C34.5057 112 31.7926 110.876 29.7922 108.876C27.7918 106.875 26.668 104.162 26.668 101.333V26.6667C26.668 23.8377 27.7918 21.1246 29.7922 19.1242C31.7926 17.1238 34.5057 16 37.3346 16H74.668L101.335 42.6667V101.333C101.335 104.162 100.211 106.875 98.2104 108.876C96.21 110.876 93.4969 112 90.668 112Z"
        stroke="#2E3452"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M48 48H53.3333"
        stroke="#2E3452"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M48 69.334H80"
        stroke="#2E3452"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M48 91H58"
        stroke="#2E3452"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
