import React, { ReactElement } from "react";

interface MosaicIconProps {
  className?: string;
}

export default function MosaicIcon({
  className,
}: MosaicIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.003.333c1.105 0 2 .916 2 2.046v1.32l.408.016c1.669.073 2.998.228 3.222.464.237.252.343 1.71.367 3.487h-.706c-1.08 0-1.957.896-1.957 2 0 1.063.81 1.931 1.833 1.997l.124.004h.646l-.027.624c-.072 1.486-.176 2.641-.28 2.863-.323.684-10.504.684-11.15 0-.644-.684-.644-10.29 0-10.975.237-.25 1.712-.41 3.518-.476V2.38c0-1.13.897-2.046 2.002-2.046z"
        fill="currentColor"
      />
    </svg>
  );
}
