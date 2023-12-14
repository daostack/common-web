import React, { FC } from "react";

interface InboxIconProps {
  className?: string;
  active?: boolean;
}

const InboxIcon: FC<InboxIconProps> = ({ className, active }) => {
  const color = "currentColor";

  return active ? (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 5621">
        <path
          id="Vector"
          d="M10.9994 8.547L21.6804 1.1C21.4894 0.769094 21.2155 0.493641 20.8857 0.300761C20.5558 0.107882 20.1815 0.0042261 19.7994 0H2.1994C1.86895 0.00152347 1.54308 0.0774699 1.24601 0.222199C0.948932 0.366928 0.688277 0.576722 0.483398 0.836L10.9994 8.547Z"
          fill={color}
        />
        <path
          id="Vector_2"
          d="M11.627 10.802C11.4407 10.9347 11.2177 11.0059 10.989 11.0059C10.7603 11.0059 10.5373 10.9347 10.351 10.802L0 3.20102V15.4C0 15.9835 0.231785 16.5431 0.644365 16.9557C1.05694 17.3682 1.61652 17.6 2.2 17.6H19.8C20.3835 17.6 20.9431 17.3682 21.3556 16.9557C21.7682 16.5431 22 15.9835 22 15.4V3.54202L11.627 10.802Z"
          fill={color}
        />
      </g>
    </svg>
  ) : (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 5620">
        <path
          id="Vector"
          d="M2.2 1H19.8C20.4577 1 21 1.54228 21 2.2V15.4C21 16.0577 20.4577 16.6 19.8 16.6H2.2C1.54228 16.6 1 16.0577 1 15.4V2.2C1 1.54228 1.54228 1 2.2 1Z"
          stroke={color}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <g id="Vector_2">
          <mask id="path-2-inside-1_11479_76904" fill="white">
            <path d="M22 2.20001L11 9.90001L0 2.20001" />
          </mask>
          <path
            d="M23.1469 3.83848C24.0518 3.20505 24.2719 1.95799 23.6385 1.05309C23.005 0.148189 21.758 -0.0718806 20.8531 0.561548L23.1469 3.83848ZM11 9.90001L9.85308 11.5385C10.5417 12.0205 11.4583 12.0205 12.1469 11.5385L11 9.90001ZM1.14692 0.561548C0.242026 -0.0718806 -1.00504 0.148189 -1.63846 1.05309C-2.27189 1.95799 -2.05182 3.20505 -1.14692 3.83848L1.14692 0.561548ZM20.8531 0.561548L9.85308 8.26155L12.1469 11.5385L23.1469 3.83848L20.8531 0.561548ZM12.1469 8.26155L1.14692 0.561548L-1.14692 3.83848L9.85308 11.5385L12.1469 8.26155Z"
            fill={color}
            mask="url(#path-2-inside-1_11479_76904)"
          />
        </g>
      </g>
    </svg>
  );
};

export default InboxIcon;
