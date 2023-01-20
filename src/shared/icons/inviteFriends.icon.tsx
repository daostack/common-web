import React, { ReactElement } from "react";

interface InviteFriendsIconProps {
  className?: string;
}

export default function InviteFriendsIcon({
  className,
}: InviteFriendsIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="17"
      height="16"
      viewBox="0 0 17 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.49992 7.33333C7.97268 7.33333 9.16659 6.13943 9.16659 4.66667C9.16659 3.19391 7.97268 2 6.49992 2C5.02716 2 3.83325 3.19391 3.83325 4.66667C3.83325 6.13943 5.02716 7.33333 6.49992 7.33333Z"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.5 14V12.6667C2.5 11.9594 2.78095 11.2811 3.28105 10.781C3.78115 10.281 4.45942 10 5.16667 10H7.83333C8.54058 10 9.21885 10.281 9.71895 10.781C10.219 11.2811 10.5 11.9594 10.5 12.6667V14"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.1667 7.33325H15.1667M13.1667 5.33325V9.33325"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
