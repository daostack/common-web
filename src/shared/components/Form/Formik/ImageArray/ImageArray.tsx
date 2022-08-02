import React, { useMemo, FC, useRef, ChangeEventHandler, useState, useEffect} from "react";
import classNames from "classnames";
import { FieldArray, FieldArrayConfig, FormikErrors } from "formik";
import { uploadFile } from "@/shared/utils/firebaseUploadFile";
import { FormikTouched } from "formik/dist/types";
import { CommonLink } from "@/shared/models";
import { ProposalImage } from "@/shared/models/governance/proposals";
import DeleteIcon from "@/shared/icons/delete.icon";
import { ButtonLink } from "../../../ButtonLink";
import { ErrorText } from "../../ErrorText";
import { TextField } from "../TextField";
import { Button, ButtonIcon, Loader, ModalFooter } from "@/shared/components";
import { Formik } from "formik";
import "./index.scss";

const ACCEPTED_EXTENSIONS = ".jpg, jpeg, .png";


interface ImageArrayProps extends FieldArrayConfig {
  values: ProposalImage[];
  title?: string;
  hint?: string;
  maxTitleLength?: number;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  onUpload: (images: ProposalImage[]) => void;
}

const ImageArray: FC<ImageArrayProps> = (props) => {
  const {
    values,
    title = "Add images",
    hint = "Resources, related content, or social pages",
    maxTitleLength,
    className,
    itemClassName,
    labelClassName,
    onUpload,
    ...restProps
  } = props;

  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [showFileLoader, setShowFileLoader] = useState(false);
  const [uploadedFiles, setUploadedFile] = useState<
    { title: string; value: string }[]
  >([]);

  const selectFiles = (event) => {
    const {files} = event.target;
    setSelectedImages([...selectedImages, ...files])
  };

  useEffect(() => {
    (async () => {
      if (selectedImages.length) {
        setShowFileLoader(true);
        const files = await Promise.all(
          selectedImages.map(async (file: File) => {
            const downloadURL = await uploadFile(file.name, "public_img", file);
            return {title: file.name, value: downloadURL}
          })
        );
        setUploadedFile((f) => [...f, ...files]);
        setShowFileLoader(false);
        setSelectedImages([])
      }
    })();
  }, [selectedImages])

  useEffect(()=> {
    uploadedFiles && onUpload(uploadedFiles)
  }, [uploadedFiles])

  const removeFile = (index: number) => {
    const f = [...uploadedFiles];
    f.splice(index, 1);
    setUploadedFile(f);
  };

  return (
        <div className={classNames("add-image-wrapper")}>
          <div className="add-images-form-wrapper">
            <div className="add-imaged-wrapper">
            </div>
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
                onClick={() => document.getElementById("file")?.click()}
              >Add images
              </ButtonLink>
              </div>
              <div className="additional-content-wrapper">
                  <div className="images-preview">
                    {uploadedFiles.map((f, i) => (
                      <div className="img-item" key={f.value}>
                        <img className="img" src={f.value} alt={i.toString()} />
                        <ButtonIcon
                          className="file-item__remove-button"
                          onClick={() => removeFile(i)}
                        >
                          <DeleteIcon className="file-item__delete-icon" />
                        </ButtonIcon>
                      </div>
                    ))}
                    {showFileLoader && (
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
