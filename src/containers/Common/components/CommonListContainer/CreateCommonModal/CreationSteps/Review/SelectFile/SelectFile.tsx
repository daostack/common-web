import React from "react";

import classNames from "classnames";
import "./index.scss";

interface SelectFileProps {
  className?: string;
}

export default function SelectFile({ className }: SelectFileProps) {
  return (
    <label
      htmlFor="cover-image"
      className={classNames("review-select-file-wrapper", className)}
    >
      <input
        type="file"
        className="review-select-file__input"
        id="cover-image"
        accept=".jpg, .jpeg, .png"
      />
      <img
        className="review-select-file__img"
        src="assets/images/select-file-img.jpg"
        alt=""
      />
    </label>
  );
}
