import React from "react";

interface LeftArrowIconProps {
  className?: string;
}

export default function LeftArrowIcon({ className }: LeftArrowIconProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none" fillRule="evenodd">
        <g fill="currentColor">
          <g>
            <g>
              <path
                d="M14.307 16l5.165 5.013c.704.683.704 1.8 0 2.483-.693.672-1.807.672-2.5 0l-6.444-6.255c-.342-.331-.528-.777-.528-1.24 0-.464.187-.911.528-1.242l6.444-6.254c.693-.673 1.808-.673 2.5 0 .704.683.704 1.8 0 2.483L14.307 16z"
                transform="translate(-24.000000, -111.000000) translate(0.000000, 95.000000) translate(24.000000, 16.000000)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
