import React, { ReactElement } from "react";

interface DownloadIconProps {
  className?: string;
}

export default function DownloadIcon({
  className,
}: DownloadIconProps): ReactElement {
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
        d="M17.285 11.357H14.53c0-2.305-.266-4.321-.625-5.742-.359-1.42-2.352-1.166-2.732 0-.38 1.167-.605 2.976-.667 4.838v.904H7.83a.5.5 0 0 0-.356.851l4.674 4.738a.5.5 0 0 0 .708.004l4.781-4.738a.5.5 0 0 0-.352-.855zm-9.785 7a1 1 0 1 0 0 2h10a1 1 0 0 0 0-2h-10z"
        fill="currentColor"
      />
    </svg>
  );
}
