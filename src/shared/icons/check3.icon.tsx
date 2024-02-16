import React, { FC } from "react";

interface Check3IconProps {
  className?: string;
}

const Check3Icon: FC<Check3IconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="8"
      height="6"
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.68472 5.27195C3.38247 5.57602 2.89203 5.57602 2.58993 5.27195L0.893683 3.56557C0.591429 3.26165 0.591429 2.76828 0.893683 2.46437C1.19579 2.16031 1.68623 2.16031 1.98848 2.46437L2.99911 3.48089C3.0754 3.5575 3.19925 3.5575 3.27569 3.48089L6.01217 0.728046C6.31428 0.423985 6.80471 0.423985 7.10697 0.728046C7.25211 0.874061 7.33366 1.07217 7.33366 1.27865C7.33366 1.48512 7.25211 1.68323 7.10697 1.82924L3.68472 5.27195Z"
        fill={color}
      />
    </svg>
  );
};

export default Check3Icon;
