import React, { ReactElement } from "react";

interface CopyLinkChainIconProps {
  className?: string;
}

export default function CopyLinkChainIcon({
  className,
}: CopyLinkChainIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 11C7.32588 11.3326 7.71485 11.5968 8.14413 11.7772C8.57341 11.9576 9.03436 12.0505 9.5 12.0505C9.96564 12.0505 10.4266 11.9576 10.8559 11.7772C11.2852 11.5968 11.6741 11.3326 12 11L16 7.00001C16.663 6.33697 17.0355 5.43769 17.0355 4.50001C17.0355 3.56233 16.663 2.66305 16 2.00001C15.337 1.33697 14.4377 0.964478 13.5 0.964478C12.5623 0.964478 11.663 1.33697 11 2.00001L10.5 2.50001"
        stroke="#A75A93"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.0004 6.99997C10.6745 6.66737 10.2855 6.40315 9.85625 6.22276C9.42697 6.04238 8.96602 5.94946 8.50038 5.94946C8.03474 5.94946 7.57378 6.04238 7.1445 6.22276C6.71523 6.40315 6.32626 6.66737 6.00038 6.99997L2.00038 11C1.33734 11.663 0.964844 12.5623 0.964844 13.5C0.964844 14.4377 1.33734 15.3369 2.00038 16C2.66342 16.663 3.5627 17.0355 4.50038 17.0355C5.43806 17.0355 6.33734 16.663 7.00038 16L7.50038 15.5"
        stroke="#A75A93"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
