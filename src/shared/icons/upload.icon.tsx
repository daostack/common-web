import React, { FC } from "react";

interface UploadIconProps {
  className?: string;
}

const UploadIcon: FC<UploadIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="45"
      height="29"
      viewBox="0 0 45 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.545 6.22573C32.325 2.62213 27.765 0.177734 22.5 0.177734C17.235 0.177734 12.675 2.60701 10.455 6.22573C4.575 6.82549 0 11.5177 0 17.223C0 23.0543 4.795 27.807 10.875 28.2455H19.47V20.0353H14.65L22.5 10.3686L30.35 20.0353H25.53V28.2405H34.1C40.19 27.8423 45 23.0593 45 17.223C45 11.5177 40.425 6.82549 34.545 6.22573Z"
        fill={color}
      />
    </svg>
  );
};

export default UploadIcon;
