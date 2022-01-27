import React from "react";
import { Colors } from "../constants/shared";

interface CheckIconProps {
  className?: string;
  fill?: string;
}

export default function CheckIcon({
  className,
  fill = Colors.purple,
}: CheckIconProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd">
        <g fill={fill} fillRule="nonzero">
          <g>
            <g>
              <g>
                <g>
                  <g>
                    <path
                      d="M3.621 5.726c-.362.365-.95.365-1.313 0L.272 3.68c-.363-.365-.363-.957 0-1.322.363-.365.951-.365 1.314 0l1.213 1.22c.091.092.24.092.331 0L6.414.274c.363-.365.951-.365 1.314 0 .174.175.272.413.272.66 0 .248-.098.486-.272.661L3.621 5.726z"
                      transform="translate(-987.000000, -626.000000) translate(0.000000, 80.000000) translate(987.000000, 533.000000) translate(0.000000, 10.000000) translate(0.000000, 3.000000) translate(4.000000, 4.000000)"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
