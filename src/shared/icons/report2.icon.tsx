import React, { FC } from "react";

interface Report2IconProps {
  className?: string;
}

const Report2Icon: FC<Report2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.5 2.75H13.25C13.7141 2.75 14.1592 2.93437 14.4874 3.26256C14.8156 3.59075 15 4.03587 15 4.5V16.75C15 17.2141 14.8156 17.6592 14.4874 17.9874C14.1592 18.3156 13.7141 18.5 13.25 18.5H2.75C2.28587 18.5 1.84075 18.3156 1.51256 17.9874C1.18437 17.6592 1 17.2141 1 16.75V4.5C1 4.03587 1.18437 3.59075 1.51256 3.26256C1.84075 2.93437 2.28587 2.75 2.75 2.75H4.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.625 1H5.375C4.89175 1 4.5 1.39175 4.5 1.875V3.625C4.5 4.10825 4.89175 4.5 5.375 4.5H10.625C11.1082 4.5 11.5 4.10825 11.5 3.625V1.875C11.5 1.39175 11.1082 1 10.625 1Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Report2Icon;
