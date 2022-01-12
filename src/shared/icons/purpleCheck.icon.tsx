import React, { ReactElement } from "react";

interface PurpleCheckIconProps {
  className?: string;
}

export default function PurpleCheckIcon({
  className,
}: PurpleCheckIconProps): ReactElement {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="12"
      viewBox="0 0 14 12"
    >
      <g fill="none" fillRule="evenodd">
        <g fill="#7786FF" fillRule="nonzero" stroke="#FFF">
          <g>
            <path
              d="M12.607 3.5c.485 0 .97.186 1.34.558.354.356.553.84.553 1.344 0 .503-.2.987-.553 1.343h0l-6.16 6.197c-.37.372-.856.558-1.34.558-.486 0-.97-.186-1.34-.558h0L2.054 9.871C1.684 9.5 1.5 9.013 1.5 8.527c0-.487.185-.973.553-1.344.37-.372.855-.558 1.34-.558.485 0 .97.186 1.34.558h0l1.481 1.49 5.062-4.624c.368-.366.85-.549 1.33-.549z"
              transform="translate(-335.000000, -502.000000) translate(318.000000, 484.000000) translate(16.000000, 15.500000)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
