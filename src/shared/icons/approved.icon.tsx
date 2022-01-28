import React, { FC } from "react";

interface ApprovedIconProps {
  className?: string;
}

const ApprovedIcon: FC<ApprovedIconProps> = ({ className }) => (
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
      d="M8 16c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zM8 1C4.14 1 1 4.14 1 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm-1.104 9.52a.501.501 0 0 0 .708 0l4.334-4.333a.5.5 0 0 0-.707-.707L7.25 9.46 5.436 7.647a.5.5 0 0 0-.707.707l2.166 2.167z"
      fill="currentColor"
    />
  </svg>
);

export default ApprovedIcon;
