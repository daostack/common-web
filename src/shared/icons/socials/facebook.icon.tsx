import React, { FC } from "react";

interface FacebookIconProps {
  className?: string;
  color?: string;
}

const FacebookIcon: FC<FacebookIconProps> = (props) => {
  const { className, color = "#0077FB" } = props;

  return (
    <svg
      className={className}
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17 0.332031C7.79531 0.332031 0.333252 7.82529 0.333252 17.0685C0.333252 25.3585 6.34195 32.2241 14.2203 33.5536V20.5602H10.1998V15.8844H14.2203V12.4366C14.2203 8.43622 16.6535 6.25624 20.2078 6.25624C21.91 6.25624 23.373 6.38362 23.7976 6.43972V10.6212L21.3325 10.6224C19.4 10.6224 19.0274 11.5444 19.0274 12.8978V15.882H23.6386L23.0371 20.5578H19.0274V33.6654C27.2736 32.6575 33.6666 25.6171 33.6666 17.0637C33.6666 7.82529 26.2045 0.332031 17 0.332031Z"
        fill={color}
      />
    </svg>
  );
};

export default FacebookIcon;
