import React, { ReactElement } from "react";

interface AddIconProps {
  className?: string;
}

export default function AddIcon({ className }: AddIconProps): ReactElement {
  return (
    <svg className={className} width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 5a2 2 0 0 1 2 2v7h7a2 2 0 1 1 0 4h-7.001L18 25a2 2 0 1 1-4 0l-.001-7H7a2 2 0 1 1 0-4h7V7a2 2 0 0 1 2-2z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}
