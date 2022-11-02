import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import GalleryIcon from "@/shared/icons/gallery.icon";
import TrashIcon from "@/shared/icons/trash.icon";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface GalleryButtonProps {
  className?: string;
  onImageSelect: (file: File | null) => void;
  ariaLabel?: string;
  shouldDeleteFile?: boolean;
}

const GalleryButton: FC<GalleryButtonProps> = (props) => {
  const { onImageSelect, ariaLabel, shouldDeleteFile = false } = props;
  const className = classNames(
    "create-common-review-gallery-button",
    props.className,
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { files } = event.target;

    if (files && files[0]) {
      onImageSelect(files[0]);
    }
  };

  const handleDeleteFile = () => {
    onImageSelect(null);
  };

  if (shouldDeleteFile) {
    return (
      <ButtonIcon className={className} onClick={handleDeleteFile}>
        <TrashIcon className="create-common-review-gallery-button__icon" />
      </ButtonIcon>
    );
  }

  return (
    <label className={className} htmlFor="file-selection-input">
      <GalleryIcon className="create-common-review-gallery-button__icon" />
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
