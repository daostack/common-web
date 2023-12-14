import React, { FC } from "react";

interface Avatar2IconProps {
  className?: string;
  color?: string;
  active?: boolean;
}

const Avatar2Icon: FC<Avatar2IconProps> = ({
  className,
  color: initialColor,
  active,
}) => {
  const color = initialColor || "#D5D5E4";

  return active ? (
    <svg
      className={className}
      width="30"
      height="30"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 5619">
        <path
          id="Vector"
          d="M22 11C22 8.82441 21.3549 6.69767 20.1462 4.88873C18.9375 3.07979 17.2195 1.66989 15.2095 0.837326C13.1995 0.00476235 10.9878 -0.213074 8.85401 0.211363C6.72022 0.6358 4.76021 1.68345 3.22183 3.22183C1.68345 4.7602 0.635804 6.72022 0.211367 8.85401C-0.213071 10.9878 0.00476617 13.1995 0.83733 15.2095C1.66989 17.2195 3.07979 18.9375 4.88873 20.1462C6.69767 21.3549 8.82441 22 11 22H11.07C13.7581 21.9952 16.3513 21.0063 18.36 19.22L18.83 18.81V18.75C20.867 16.6856 22.0063 13.9002 22 11ZM4.64 4.64C6.2688 3.04713 8.44106 2.13124 10.7186 2.07707C12.9962 2.0229 15.2095 2.83449 16.9122 4.34812C18.6149 5.86175 19.6802 7.96478 19.8932 10.233C20.1062 12.5012 19.4511 14.7658 18.06 16.57C17.7858 15.9413 17.38 15.3787 16.87 14.92C16.1665 14.3093 15.2614 13.9814 14.33 14H7.8C7.21948 13.9971 6.64559 14.1235 6.12 14.37C5.24216 14.7854 4.53539 15.4922 4.12 16.37C4.07 16.46 4.04 16.55 4 16.64C2.61073 14.9112 1.90874 12.7302 2.0287 10.5156C2.14866 8.301 3.08212 6.20865 4.65 4.64H4.64Z"
          fill="#C32EA3"
        />
        <path
          id="Vector_2"
          d="M11 13C13.2091 13 15 11.2091 15 9C15 6.79086 13.2091 5 11 5C8.79086 5 7 6.79086 7 9C7 11.2091 8.79086 13 11 13Z"
          fill="#C32EA3"
        />
      </g>
    </svg>
  ) : (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="profile=off">
        <path
          id="Vector"
          d="M5.51953 19C6.15953 16.8 7.35953 16 8.73953 16H15.2595C16.6395 16 17.8395 16.8 18.4795 19"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_2"
          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          id="Vector_3"
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
    </svg>
  );
};

export default Avatar2Icon;
