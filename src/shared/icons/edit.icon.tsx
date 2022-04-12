import React, { ReactElement } from "react";

interface EditIconProps {
  className?: string;
}

export default function EditIcon({ className }: EditIconProps): ReactElement {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="m20.173 15.827-.675.674-.687.68-1.04 1.017c-3.002 2.922-5.929 5.616-6.725 6.158-.671.458-4.187 2.073-5.075 1.115-.745-.802.855-4.249 1.242-4.947.56-1.007 4.043-4.768 7.452-8.189l.68-.678c.664-.66 1.318-1.3 1.94-1.894l4.462 4.463c-.498.515-1.028 1.053-1.574 1.6zm5.203-5.867c-.042.302-.77 1.201-1.88 2.415l-4.349-4.35c1.222-1.101 2.128-1.822 2.43-1.864 1.27-.177 3.976 2.528 3.799 3.8z"
        fill="currentColor"
      />
    </svg>
  );
}
