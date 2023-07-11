import React, { FC } from "react";

interface Trash2IconProps {
  className?: string;
}

const Trash2Icon: FC<Trash2IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="18"
      height="20"
      viewBox="0 0 18 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 4.55469H2.77778H17"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2223 4.55556V17C15.2223 17.4715 15.035 17.9237 14.7016 18.2571C14.3682 18.5905 13.916 18.7778 13.4445 18.7778H4.55561C4.08411 18.7778 3.63193 18.5905 3.29853 18.2571C2.96513 17.9237 2.77783 17.4715 2.77783 17V4.55556M5.4445 4.55556V2.77778C5.4445 2.30628 5.6318 1.8541 5.9652 1.5207C6.2986 1.1873 6.75078 1 7.22228 1H10.7778C11.2493 1 11.7015 1.1873 12.0349 1.5207C12.3683 1.8541 12.5556 2.30628 12.5556 2.77778V4.55556"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.22217 9V14.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.7778 9V14.3333"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Trash2Icon;
