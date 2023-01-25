import React, { FC } from "react";

interface LinkedInIconProps {
  className?: string;
}

const LinkedInIcon: FC<LinkedInIconProps> = (props) => {
  const { className } = props;

  return (
    <svg
      className={className}
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.7227 0.222656C7.88609 0.222656 0.722717 7.38603 0.722717 16.2226C0.722717 25.0592 7.88609 32.2226 16.7227 32.2226C25.5593 32.2226 32.7227 25.0592 32.7227 16.2226C32.7227 7.38603 25.5592 0.222656 16.7227 0.222656ZM12.4539 23.9579H8.94091V12.6085H12.4539V23.9579ZM10.6806 11.1222C9.53335 11.1222 8.60327 10.1846 8.60327 9.02809C8.60327 7.87147 9.53348 6.93387 10.6806 6.93387C11.8278 6.93387 12.7579 7.87147 12.7579 9.02809C12.758 10.1846 11.8279 11.1222 10.6806 11.1222ZM25.6187 23.9579H22.1227V18.0004C22.1227 16.3664 21.5021 15.4544 20.2101 15.4544C18.8039 15.4544 18.0693 16.4043 18.0693 18.0004V23.9579H14.7V12.6085H18.0693V14.1371C18.0693 14.1371 19.0828 12.2623 21.4894 12.2623C23.896 12.2623 25.6187 13.7318 25.6187 16.7716L25.6187 23.9579Z"
        fill="url(#paint0_linear_6881_4136)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_6881_4136"
          x1="5.40899"
          y1="4.90893"
          x2="28.0364"
          y2="27.5363"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2489BE" />
          <stop offset="1" stopColor="#0575B3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default LinkedInIcon;
