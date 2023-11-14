import React, { FC } from "react";

interface SidebarIconProps {
  className?: string;
}

const SidebarIcon: FC<SidebarIconProps> = ({ className }) => {
  const color = "currentColor";

  return (
    <svg
      className={className}
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 3H2.5V6H4V3ZM20 6C20.8284 6 21.5 5.32843 21.5 4.5C21.5 3.67157 20.8284 3 20 3V6ZM4 6H20V3H4V6Z"
        fill={color}
      />
      <path
        d="M4 11H2.5V14H4V11ZM16 14C16.8284 14 17.5 13.3284 17.5 12.5C17.5 11.6716 16.8284 11 16 11V14ZM4 14H16V11H4V14Z"
        fill={color}
      />
      <path
        d="M4 19H2.5V22H4V19ZM15 22C15.8284 22 16.5 21.3284 16.5 20.5C16.5 19.6716 15.8284 19 15 19V22ZM4 22H15V19H4V22Z"
        fill={color}
      />
    </svg>
  );
};

export default SidebarIcon;
