import React, { ReactElement } from "react";

interface ZoomInIconProps {
  className?: string;
}

export default function ZoomInIcon({
  className,
}: ZoomInIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="25"
      height="25"
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.071 10.767c0 4.148-3.243 7.51-7.243 7.51s-7.242-3.362-7.242-7.51 3.242-7.511 7.242-7.511 7.243 3.363 7.243 7.51zm-1.331 7.675a9.224 9.224 0 0 1-5.912 2.147c-5.23 0-9.471-4.397-9.471-9.822 0-5.425 4.24-9.822 9.471-9.822S20.3 5.342 20.3 10.767c0 2.249-.73 4.322-1.956 5.977l4.967 5.262c.442.469.442 1.229 0 1.698a1.09 1.09 0 0 1-1.604 0l-4.967-5.262z"
        fill="currentColor"
      />
      <rect
        x="6.5"
        y="10"
        width="8.25"
        height="1.5"
        rx=".75"
        fill="currentColor"
      />
      <rect
        x="10"
        y="14.75"
        width="8.25"
        height="1.5"
        rx=".75"
        transform="rotate(-90 10 14.75)"
        fill="currentColor"
      />
    </svg>
  );
}
