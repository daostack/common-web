import React, { ReactElement } from "react";

interface SelectedCheckboxIconProps {
  className?: string;
}

export default function SelectedCheckboxIcon({ className }: SelectedCheckboxIconProps): ReactElement {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" fillRule="evenodd">
        <path
          d="M3.923 2h16.154c.669 0 .911.07 1.156.2.244.131.436.323.567.567.13.245.2.487.2 1.156v16.154c0 .669-.07.911-.2 1.156-.131.244-.323.436-.567.567-.245.13-.487.2-1.156.2H3.923c-.669 0-.911-.07-1.156-.2a1.363 1.363 0 0 1-.567-.567c-.13-.245-.2-.487-.2-1.156V3.923c0-.669.07-.911.2-1.156.131-.244.323-.436.567-.567.245-.13.487-.2 1.156-.2z"
          fill="#7786FF"
        />
        <path
          d="M11.621 14.726a.925.925 0 0 1-1.313 0L8.272 12.68a.938.938 0 0 1 0-1.322.925.925 0 0 1 1.314 0l1.213 1.22c.091.092.24.092.331 0l3.284-3.303a.925.925 0 0 1 1.314 0 .937.937 0 0 1 0 1.321l-4.107 4.131z"
          fill="#FFF"
        />
      </g>
    </svg>
  );
}
