import React, { ReactElement } from "react";

interface Link2IconProps {
  className?: string;
}

export default function Link2Icon({ className }: Link2IconProps): ReactElement {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 10.8851C7.32588 11.2177 7.71485 11.482 8.14413 11.6624C8.57341 11.8427 9.03436 11.9357 9.5 11.9357C9.96564 11.9357 10.4266 11.8427 10.8559 11.6624C11.2852 11.482 11.6741 11.2177 12 10.8851L16 6.88514C16.663 6.2221 17.0355 5.32283 17.0355 4.38514C17.0355 3.44746 16.663 2.54818 16 1.88514C15.337 1.2221 14.4377 0.849609 13.5 0.849609C12.5623 0.849609 11.663 1.2221 11 1.88514L10.5 2.38514"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9999 6.88547C10.674 6.55287 10.285 6.28864 9.85576 6.10826C9.42648 5.92787 8.96553 5.83496 8.49989 5.83496C8.03425 5.83496 7.57329 5.92787 7.14402 6.10826C6.71474 6.28864 6.32577 6.55287 5.99989 6.88547L1.99989 10.8855C1.33685 11.5485 0.964355 12.4478 0.964355 13.3855C0.964355 14.3232 1.33685 15.2224 1.99989 15.8855C2.66293 16.5485 3.56221 16.921 4.49989 16.921C5.43757 16.921 6.33685 16.5485 6.99989 15.8855L7.49989 15.3855"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
