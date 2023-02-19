import React, { FC } from "react";

interface NewTabIconProps {
  className?: string;
}

const NewTabIcon: FC<NewTabIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 9.5V13.25C12.5 13.6478 12.342 14.0294 12.0607 14.3107C11.7794 14.592 11.3978 14.75 11 14.75H2.75C2.35218 14.75 1.97064 14.592 1.68934 14.3107C1.40804 14.0294 1.25 13.6478 1.25 13.25V5C1.25 4.175 1.925 3.5 2.75 3.5H6.5M10.25 1.25H14.75V5.75M6.5 9.5L14.15 1.85"
        stroke={color}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default NewTabIcon;
