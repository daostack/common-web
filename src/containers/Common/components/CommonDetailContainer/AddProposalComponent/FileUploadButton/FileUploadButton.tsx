import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { FileInfo } from "../FileInfo";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png, .pdf";

interface FileInfoProps {
  className?: string;
  file: File | null;
  text: string;
  hint?: string;
  logo: string;
  logoUploaded: string;
  alt: string;
  onUpload: (file: File) => void;
  onDelete: () => void;
}

const FileUploadButton: FC<FileInfoProps> = (props) => {
  const {
    className,
    file,
    text,
    hint,
    logo,
    logoUploaded,
    alt,
    onUpload,
    onDelete,
  } = props;

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      onUpload(file);
    }
  };

  const renderUploadContent = () => (
    <label className="bank-account-file-info-upload__container">
      <img
        className="bank-account-file-info-upload__icon"
        src={logo}
        alt={alt}
      />
      {text}
      {hint && (
        <span className="bank-account-file-info-upload__button-hint">
          {hint}
        </span>
      )}
      <input
        className="bank-account-file-info-upload__file-input"
        type="file"
        onChange={handleChange}
        accept={ACCEPTED_EXTENSIONS}
      />
    </label>
  );

  const renderUploadedContent = () => (
    <div className="bank-account-file-info-upload__container bank-account-file-info-upload__container--between">
      <img
        className="bank-account-file-info-upload__icon"
        src={logoUploaded}
        alt={alt}
      />
      {file && <FileInfo file={file} onDelete={onDelete} />}
    </div>
  );

  return (
    <div className={classNames("bank-account-file-info-upload", className)}>
      {file ? renderUploadedContent() : renderUploadContent()}
    </div>
  );
};

export default FileUploadButton;
