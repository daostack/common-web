import React from "react";
import { Colors } from "../constants";

export default function CloseIcon(props) {
  return (
    <svg
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? "16"}
      height={props.height ?? "16"}
      viewBox="0 0 16 16"
    >
      <g fill="none" fillRule="evenodd">
        <g fill={props.fill ?? Colors.black}>
          <g>
            <g>
              <path
                d="M2.979 2.979c.416-.416 1.09-.416 1.506 0L8 6.494l3.515-3.515c.416-.416 1.09-.416 1.506 0 .416.416.416 1.09 0 1.506L9.506 8l3.515 3.515c.416.416.416 1.09 0 1.506-.416.416-1.09.416-1.506 0L8 9.506l-3.515 3.515c-.416.416-1.09.416-1.506 0-.416-.416-.416-1.09 0-1.506L6.494 8 2.979 4.485c-.416-.416-.416-1.09 0-1.506z"
                transform="translate(-336 -104) translate(8 76) translate(328 28)"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
