import React, { ReactElement } from "react";

interface RegularCheckboxIconProps {
  className?: string;
}

export default function RegularCheckboxIcon({ className }: RegularCheckboxIconProps): ReactElement {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.75 2.002 20.078 2c.669 0 .911.07 1.156.2.244.131.436.323.567.567.13.245.2.487.2 1.156v16.154c0 .669-.07.911-.2 1.156-.131.244-.323.436-.567.567-.245.13-.487.2-1.156.2H3.923c-.669 0-.911-.07-1.156-.2a1.363 1.363 0 0 1-.567-.567c-.118-.223-.187-.443-.198-.984L2 3.923c0-.669.07-.911.2-1.156.131-.244.323-.436.567-.567.223-.118.443-.187.984-.198zM20 4H4v16h16V4z"
        fill="#979BBA"
        fillRule="nonzero"
      />
    </svg>
  );
}
