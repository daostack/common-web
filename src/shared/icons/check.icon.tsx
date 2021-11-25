import React, { ReactElement } from "react";

interface CheckIconProps {
  className?: string;
}

export default function CheckIcon({ className }: CheckIconProps): ReactElement {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.243 17.453a1.85 1.85 0 0 1-2.628 0l-4.07-4.096a1.877 1.877 0 0 1 0-2.643 1.85 1.85 0 0 1 2.627 0l2.425 2.44c.183.184.48.184.664 0l6.567-6.607a1.85 1.85 0 0 1 2.628 0 1.875 1.875 0 0 1 0 2.643l-8.213 8.263z"
        fill="#7786FF"
        fillRule="nonzero"
      />
    </svg>
  );
}
