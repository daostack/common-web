import React from "react";

export default function ArrowIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g fill="none" fill-rule="evenodd">
      <g fill={props.fill ?? "#000000"}>
        <g>
          <g>
            <path d="M2.979 2.979c.416-.416 1.09-.416 1.506 0L8 6.494l3.515-3.515c.416-.416 1.09-.416 1.506 0 .416.416.416 1.09 0 1.506L9.506 8l3.515 3.515c.416.416.416 1.09 0 1.506-.416.416-1.09.416-1.506 0L8 9.506l-3.515 3.515c-.416.416-1.09.416-1.506 0-.416-.416-.416-1.09 0-1.506L6.494 8 2.979 4.485c-.416-.416-.416-1.09 0-1.506z" transform="translate(-336 -104) translate(8 76) translate(328 28)" />
          </g>
        </g>
      </g>
    </g>
  </svg>
}
