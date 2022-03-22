import React, { ReactElement } from "react";

interface ExplanationIconProps {
  className?: string;
}

export default function ExplanationIcon({ className }: ExplanationIconProps): ReactElement {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0zm-.077 8.208a.803.803 0 0 0-.582.219.74.74 0 0 0-.228.557c0 .222.075.405.223.55.148.144.344.216.587.216s.438-.072.586-.217a.735.735 0 0 0 .223-.55.74.74 0 0 0-.228-.556.803.803 0 0 0-.581-.22zm.1-5.958c-.7 0-1.252.181-1.656.544-.36.323-.562.756-.607 1.299l-.01.208h1.448c.007-.268.084-.48.233-.632.148-.153.345-.23.591-.23.52 0 .78.284.78.852 0 .189-.05.367-.15.537-.1.17-.3.39-.602.66-.301.27-.509.546-.622.824-.094.233-.15.532-.165.897l-.005.227h1.279l.02-.307c.031-.282.142-.534.333-.754l.101-.108.405-.388c.316-.31.538-.59.664-.844.127-.254.19-.524.19-.81 0-.628-.195-1.114-.584-1.458-.39-.345-.938-.517-1.644-.517z"
        fill="#7786FF"
        fillRule="nonzero"
      />
    </svg>
  );
}
