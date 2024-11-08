import React, { FC } from "react";

interface TelegramIconProps {
  className?: string;
  color?: string;
}

const TelegramIcon: FC<TelegramIconProps> = (props) => {
  const { className, color = "#34AADF" } = props;

  return (
    <svg
      className={className}
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_6881_4142)">
        <path
          d="M15.9999 32.2227C24.8364 32.2227 31.9999 25.0592 31.9999 16.2227C31.9999 7.38611 24.8364 0.222656 15.9999 0.222656C7.16333 0.222656 -0.00012207 7.38611 -0.00012207 16.2227C-0.00012207 25.0592 7.16333 32.2227 15.9999 32.2227Z"
          fill={color}
        />
        <path
          d="M6.65884 16.0838C6.65884 16.0838 14.6588 12.8006 17.4334 11.6445C18.497 11.1821 22.1039 9.70234 22.1039 9.70234C22.1039 9.70234 23.7687 9.05498 23.6299 10.6272C23.5836 11.2746 23.2137 13.5405 22.8438 15.9914C22.2889 19.4596 21.6877 23.2515 21.6877 23.2515C21.6877 23.2515 21.5952 24.3151 20.8091 24.5C20.023 24.685 18.7281 23.8527 18.497 23.6677C18.312 23.529 15.0288 21.448 13.8265 20.4307C13.5027 20.1532 13.1328 19.5983 13.8727 18.9509C15.5374 17.4249 17.5258 15.529 18.7281 14.3267C19.2831 13.7717 19.838 12.4769 17.5258 14.0492C14.2426 16.3151 11.0057 18.4422 11.0057 18.4422C11.0057 18.4422 10.2657 18.9046 8.87848 18.4884C7.49116 18.0723 5.87268 17.5174 5.87268 17.5174C5.87268 17.5174 4.76285 16.8237 6.65884 16.0838Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_6881_4142">
          <rect
            width="32"
            height="32"
            fill="white"
            transform="translate(-0.00012207 0.222656)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TelegramIcon;
