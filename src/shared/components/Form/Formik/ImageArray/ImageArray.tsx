import React, { ChangeEventHandler, FC } from "react";
import classNames from "classnames";
import { useFormikContext } from "formik";
import { ButtonIcon, ButtonLink, Loader } from "@/shared/components";
import { useImageSizeCheck } from "@/shared/hooks";
import DeleteIcon from "@/shared/icons/delete.icon";
import { ProposalImage } from "@/shared/models/governance/proposals";
import {
  getFileNameForUploading,
  uploadFile,
} from "@/shared/utils/firebaseUploadFile";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";

interface ImageArrayProps {
  name: string;
  values: ProposalImage[];
  areImagesLoading: boolean;
  loadingFieldName: string;
  title?: string;
}

const ImageArray: FC<ImageArrayProps> = (props) => {
  const {
    values,
    name,
    areImagesLoading = false,
    loadingFieldName,
    title = "Add images",
  } = props;
  const { setFieldValue } = useFormikContext();
  const { checkImageSize } = useImageSizeCheck();

  const handleAddImageClick = () => {
    if (!areImagesLoading) {
      document.getElementById("file")?.click();
    }
  };

  const setLoadingState = (isLoading: boolean) => {
    setFieldValue(loadingFieldName, isLoading);
  };

  const updateUploadedFiles = (files: ProposalImage[]) => {
    setFieldValue(name, files);
  };

  const selectFiles: ChangeEventHandler<HTMLInputElement> = async (event) => {
    const { files } = event.target;

    if (!files || files.length === 0) {
      return;
    }

        setLoadingState(true);

    try {
      const uploadedFiles = await Promise.all(
        Array.from(files)
          .map(async (file): Promise<ProposalImage | null> => {
            if (!checkImageSize(file.name, file.size)) {
              return null;
            }

            const fileName = getFileNameForUploading(file.name);
            const downloadURL = await uploadFile(fileName, "public_img", file);

            return {
              title: fileName,
              value: downloadURL,
            };
          })
          .filter(Boolean),
      );

      updateUploadedFiles(values.concat(uploadedFiles as ProposalImage[]));
      setLoadingState(false);
    } catch (error) {
      setLoadingState(false);
    }
  };

  const removeFile = (index: number) => {
    const files = [...values];
    files.splice(index, 1);
    updateUploadedFiles(files);
  };

  return (
    <div className={classNames("add-image-wrapper")}>
      <div className="add-images-form-wrapper">
        <div className="add-imaged-wrapper"></div>
        <div className="add-additional-information">
          <div className="images-wrapper">
            <input
              id="file"
              type="file"
              onChange={selectFiles}
              accept={ACCEPTED_EXTENSIONS}
              style={{ display: "none" }}
              multiple
            />

            <ButtonLink
              className="images-array__add-button"
              onClick={handleAddImageClick}
            >
              {title}
            </ButtonLink>
          </div>
          <div className="additional-content-wrapper">
            <div className="images-preview">
              {values.map((file, index) => (
                <div className="img-item" key={file.value}>
                  <img
                    className="img"
                    src={file.value}
                    alt={index.toString()}
                  />
                  <ButtonIcon
                    className="additional-content-wrapper__delete-button"
                    onClick={() => removeFile(index)}
                    disabled={areImagesLoading}
                  >
                    <DeleteIcon className="file-item__delete-icon" />
                  </ButtonIcon>
                </div>
              ))}
              {areImagesLoading && (
                <div className="img-item">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageArray;
