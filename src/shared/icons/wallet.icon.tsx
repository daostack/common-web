import React, { FC } from "react";

interface WalletIconProps {
  className?: string;
}

const WalletIcon: FC<WalletIconProps> = ({ className }) => (
  <svg
    className={className}
    width="17"
    height="18"
    viewBox="0 0 17 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5 5V2C13.5 1.73478 13.3946 1.48043 13.2071 1.29289C13.0196 1.10536 12.7652 1 12.5 1H2.5C1.96957 1 1.46086 1.21071 1.08579 1.58579C0.710714 1.96086 0.5 2.46957 0.5 3M0.5 3C0.5 3.53043 0.710714 4.03914 1.08579 4.41421C1.46086 4.78929 1.96957 5 2.5 5H14.5C14.7652 5 15.0196 5.10536 15.2071 5.29289C15.3946 5.48043 15.5 5.73478 15.5 6V9M0.5 3V15C0.5 15.5304 0.710714 16.0391 1.08579 16.4142C1.46086 16.7893 1.96957 17 2.5 17H14.5C14.7652 17 15.0196 16.8946 15.2071 16.7071C15.3946 16.5196 15.5 16.2652 15.5 16V13"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 9V13H12.5C11.9696 13 11.4609 12.7893 11.0858 12.4142C10.7107 12.0391 10.5 11.5304 10.5 11C10.5 10.4696 10.7107 9.96086 11.0858 9.58579C11.4609 9.21071 11.9696 9 12.5 9H16.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default WalletIcon;
