import React, { FC } from "react";

interface Edit2IconProps {
  className?: string;
}

const Edit2Icon: FC<Edit2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.50008 3.66675H2.50008C2.14646 3.66675 1.80732 3.80722 1.55727 4.05727C1.30722 4.30732 1.16675 4.64646 1.16675 5.00008V11.0001C1.16675 11.3537 1.30722 11.6928 1.55727 11.9429C1.80732 12.1929 2.14646 12.3334 2.50008 12.3334H8.50008C8.8537 12.3334 9.19284 12.1929 9.44289 11.9429C9.69294 11.6928 9.83341 11.3537 9.83341 11.0001V9.00008"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5 9.00007H6.5L12.1667 3.3334C12.4319 3.06819 12.5809 2.70848 12.5809 2.3334C12.5809 1.95833 12.4319 1.59862 12.1667 1.3334C11.9014 1.06819 11.5417 0.919189 11.1667 0.919189C10.7916 0.919189 10.4319 1.06819 10.1667 1.3334L4.5 7.00007V9.00007Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.16675 2.33325L11.1667 4.33325"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Edit2Icon;
