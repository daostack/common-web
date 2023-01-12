import React, { ReactElement } from "react";

interface VoteAgainstIconProps {
  className?: string;
}

export default function VoteAgainstIcon({
  className,
}: VoteAgainstIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1479 22C17.6708 22 22.1479 17.5228 22.1479 12C22.1479 6.47715 17.6708 2 12.1479 2C6.6251 2 2.14795 6.47715 2.14795 12C2.14795 17.5228 6.6251 22 12.1479 22Z"
        stroke="#979BBA"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
