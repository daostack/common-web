import React, { ReactElement } from "react";

interface ReportIconProps {
  className?: string;
}

export default function ReportIcon({ className }: ReportIconProps): ReactElement {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM12.675 4.23873L4.23873 12.675C5.26765 13.5038 6.57589 14 8 14C11.3137 14 14 11.3137 14 8C14 6.57589 13.5038 5.26765 12.675 4.23873ZM8 2C4.68629 2 2 4.68629 2 8C2 9.1667 2.333 10.2556 2.90913 11.1769L11.1769 2.90913C10.2556 2.333 9.1667 2 8 2Z"
        fill="#FF603E"
      />
    </svg>
  );
}
