import React, { ReactElement } from "react";

interface HideIconProps {
  className?: string;
}

export default function HideIcon({ className }: HideIconProps): ReactElement {
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
        d="M10.5851 10.5879C10.21 10.963 9.99942 11.4718 9.99951 12.0022C9.99961 12.5327 10.2104 13.0414 10.5856 13.4164C10.9607 13.7914 11.4695 14.002 11.9999 14.0019C12.5304 14.0018 13.039 13.791 13.4141 13.4159"
        stroke="#131B23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.681 16.673C15.2782 17.5507 13.6547 18.0109 12 18C8.4 18 5.4 16 3 12C4.272 9.88003 5.712 8.32203 7.32 7.32603M10.18 6.18003C10.779 6.05876 11.3888 5.99845 12 6.00003C15.6 6.00003 18.6 8.00003 21 12C20.334 13.11 19.621 14.067 18.862 14.87"
        stroke="#131B23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 3L21 21"
        stroke="#131B23"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
