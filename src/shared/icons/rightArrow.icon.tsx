import React, { ReactElement } from "react";

interface RightArrowIconProps {
  className?: string;
}

export default function RightArrowIcon({
  className,
}: RightArrowIconProps): ReactElement {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd">
        <g fill="currentColor">
          <g>
            <g>
              <g>
                <g>
                  <path
                    d="M8.846 8l-2.582 2.506c-.352.342-.352.9 0 1.242.346.336.904.336 1.25 0l3.222-3.127c.17-.166.264-.39.264-.62 0-.233-.093-.456-.264-.622L7.514 4.252c-.346-.336-.904-.336-1.25 0-.352.342-.352.9 0 1.242L8.846 8z"
                    transform="translate(-1288.000000, -643.000000) translate(120.000000, 40.000000) translate(821.000000, 412.000000) translate(0.000000, 161.000000) translate(347.000000, 30.000000)"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
