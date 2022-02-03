import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import ShareIcon from "@/shared/icons/share.icon";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface GalleryButtonProps {
  className?: string;
  onImageSelect: (file: File) => void;
  ariaLabel?: string;
}

const GalleryButton: FC<GalleryButtonProps> = (props) => {
  const { onImageSelect, ariaLabel } = props;
  const className = classNames(
    "create-common-review-gallery-button",
    props.className
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;

    if (files && files[0]) {
      onImageSelect(files[0]);
    }
  };

  return (
    <label className={className} htmlFor="file-selection-input">
      <ShareIcon />
      <input
        id="file-selection-input"
        className="create-common-review-gallery-button__file-input"
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        onChange={handleChange}
        aria-label={ariaLabel || "Select file"}
      />
    </label>
  );
};

export default GalleryButton;
