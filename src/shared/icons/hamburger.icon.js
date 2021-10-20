import React from "react";
import { Colors } from "../constants";

export default function HamburgerIcon(props) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <g fill={props.fill ?? Colors.black} fillRule="evenodd">
      <g fill="#000">
        <g>
          <path d="M20.5 18c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5S2.672 18 3.5 18h17zm0-8c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-17c-.828 0-1.5-.672-1.5-1.5S2.672 10 3.5 10h17zm0-8c.828 0 1.5.672 1.5 1.5S21.328 5 20.5 5h-17C2.672 5 2 4.328 2 3.5S2.672 2 3.5 2h17z" transform="translate(-24 -126) translate(24 126)" />
        </g>
      </g>
    </g>
  </svg>
}
