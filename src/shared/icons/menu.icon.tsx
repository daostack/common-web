import React, { ReactElement } from "react";

interface MenuIconProps {
  className?: string;
}

export default function MenuIcon({ className }: MenuIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
