import React, { ReactElement } from "react";

interface ArrowBackIconProps {
  className?: string;
}

export default function ArrowBackIcon({
  className,
}: ArrowBackIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 5L5 12L12 19M19 12H6H19Z"
        stroke="#001A36"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
