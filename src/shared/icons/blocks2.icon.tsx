import React, { FC } from "react";

interface Blocks2IconProps {
  className?: string;
  active?: boolean;
}

const Blocks2Icon: FC<Blocks2IconProps> = ({ className, active }) => {
  const color = "currentColor";

  return active ? (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 4.125V10.875H13.125V3H19.875C20.1734 3 20.4595 3.11853 20.6705 3.32951C20.8815 3.54048 21 3.82663 21 4.125ZM4.125 3H10.875V10.875H3V4.125C3 3.82663 3.11853 3.54048 3.32951 3.32951C3.54048 3.11853 3.82663 3 4.125 3ZM3 19.875V13.125H10.875V21H4.125C3.82663 21 3.54048 20.8815 3.32951 20.6705C3.11853 20.4595 3 20.1734 3 19.875ZM19.875 21H13.125V13.125H21V19.875C21 20.1734 20.8815 20.4595 20.6705 20.6705C20.4595 20.8815 20.1734 21 19.875 21Z"
        fill={color}
      />
    </svg>
  ) : (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 4.125V10.875H13.125V3H19.875C20.1734 3 20.4595 3.11853 20.6705 3.32951C20.8815 3.54048 21 3.82663 21 4.125ZM4.125 3H10.875V10.875H3V4.125C3 3.82663 3.11853 3.54048 3.32951 3.32951C3.54048 3.11853 3.82663 3 4.125 3ZM3 19.875V13.125H10.875V21H4.125C3.82663 21 3.54048 20.8815 3.32951 20.6705C3.11853 20.4595 3 20.1734 3 19.875ZM19.875 21H13.125V13.125H21V19.875C21 20.1734 20.8815 20.4595 20.6705 20.6705C20.4595 20.8815 20.1734 21 19.875 21Z"
        fill={color}
      />
    </svg>
  );
};

export default Blocks2Icon;
