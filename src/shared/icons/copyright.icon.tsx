import React, { FC } from "react";

interface CopyrightIconProps {
  className?: string;
}

const CopyrightIcon: FC<CopyrightIconProps> = ({ className }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 12C2.69166 12 0 9.30834 0 6C0 2.69166 2.69166 0 6 0C9.30834 0 12 2.69166 12 6C12 9.30834 9.30834 12 6 12ZM6 0.750003C3.1051 0.750003 0.750003 3.1051 0.750003 6C0.750003 8.8949 3.1051 11.25 6 11.25C8.8949 11.25 11.25 8.8949 11.25 6C11.25 3.1051 8.8949 0.750003 6 0.750003ZM2.99999 6C2.99999 7.6542 4.34583 9.00001 6 9.00001C6.813 8.99999 7.57396 8.68029 8.1427 8.09947L7.60731 7.57431C7.18031 8.01011 6.60975 8.24998 6 8.24998C4.75927 8.24998 3.74999 7.2407 3.74999 5.99997C3.74999 4.75924 4.75927 3.74996 6 3.74996C6.61013 3.74996 7.18069 3.98983 7.60731 4.42563L8.14344 3.90123C7.57434 3.32006 6.81335 2.99999 6 2.99999C4.3458 2.99999 2.99999 4.3458 2.99999 6Z"
      fill="currentColor"
    />
  </svg>
);

export default CopyrightIcon;
