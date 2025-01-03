import React, { FC } from "react";

interface PhoneIconProps {
  className?: string;
}

export const PhoneIcon: FC<PhoneIconProps> = ({ className }) => {
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
        d="M10.633 13.368c-1.529-1.529-1.874-3.058-1.952-3.67a.549.549 0 0 1 .158-.46l1.237-1.236a.552.552 0 0 0 .078-.684L8.184 4.26a.552.552 0 0 0-.715-.202l-3.162 1.49a.55.55 0 0 0-.304.548c.166 1.574.852 5.444 4.654 9.247 3.803 3.802 7.672 4.488 9.247 4.654a.55.55 0 0 0 .548-.304l1.49-3.162a.552.552 0 0 0-.2-.714l-3.06-1.97a.552.552 0 0 0-.683.078l-1.236 1.237a.549.549 0 0 1-.46.158c-.612-.078-2.141-.423-3.67-1.952z"
        fill="currentColor"
      />
    </svg>
  );
};

export default PhoneIcon;
