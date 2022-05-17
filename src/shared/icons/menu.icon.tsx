import React, { ReactElement, useMemo } from "react";
import { Orientation } from "@/shared/constants";

interface MenuIconProps {
  className?: string;
  variant?: Orientation;
}

export default function MenuIcon({ className, variant = Orientation.Vertical }: MenuIconProps): ReactElement {
  const vectorByVariant = useMemo(
    () => (
      (variant === Orientation.Vertical)
        ? "M12 17a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
        : "M16.5 12C16.5 10.7574 17.5074 9.75 18.75 9.75C19.9926 9.75 21 10.7574 21 12C21 13.2426 19.9926 14.25 18.75 14.25C17.5074 14.25 16.5 13.2426 16.5 12ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12ZM3 12C3 10.7574 4.00736 9.75 5.25 9.75C6.49264 9.75 7.5 10.7574 7.5 12C7.5 13.2426 6.49264 14.25 5.25 14.25C4.00736 14.25 3 13.2426 3 12Z"
    ),
    [variant]
  );

  return (
    <svg
      className={className}
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d={vectorByVariant}
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
