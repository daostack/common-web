import React, { ReactElement } from "react";

interface ShareIconProps {
  className?: string;
}

export default function ShareIcon({ className }: ShareIconProps): ReactElement {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <g fill="none" fillRule="evenodd">
        <g fill="#001A36" fillRule="nonzero">
          <g>
            <g>
              <g>
                <path
                  d="M17.625 14.25c-1.272 0-2.38.708-2.956 1.75l-5.083-2.965c.106-.327.164-.674.164-1.035 0-.361-.058-.708-.164-1.035L14.67 8c.575 1.042 1.684 1.75 2.956 1.75C19.486 9.75 21 8.236 21 6.375S19.486 3 17.625 3 14.25 4.514 14.25 6.375c0 .184.019.364.047.54L9.063 9.968c-.616-.814-1.59-1.343-2.688-1.343C4.514 8.625 3 10.139 3 12s1.514 3.375 3.375 3.375c1.098 0 2.072-.53 2.688-1.343l5.234 3.053c-.028.176-.047.356-.047.54 0 1.861 1.514 3.375 3.375 3.375S21 19.486 21 17.625s-1.514-3.375-3.375-3.375z"
                  transform="translate(-103.000000, -663.000000) translate(0.000000, 155.000000) translate(23.000000, 492.000000) translate(80.000000, 16.000000)"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
