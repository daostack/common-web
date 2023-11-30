import React, { useMemo } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import { FileIcon } from "@/shared/icons";
import { convertBytes } from "@/shared/utils/convertBytes";
import { getFileName } from "./util";
import styles from "./FilePreview.module.scss";

export enum FilePreviewVariant {
  extraSmall = "extraSmall",
  small = "small",
  medium = "medium",
}

interface FilePreviewProps {
  name: string;
  src: string;
  fileSize?: number;
  size?: number;
  variant?: FilePreviewVariant;
  iconContainerClassName?: string;
  containerClassName?: string;
  isCurrentUser?: boolean;
  isPreview?: boolean;
}

export default function FilePreview(props: FilePreviewProps) {
  const {
    name,
    src,
    variant = FilePreviewVariant.small,
    iconContainerClassName,
    containerClassName,
    size,
    fileSize,
    isCurrentUser,
    isPreview = false,
  } = props;

  const extension = useMemo(() => name.split(".")[1], [name]);

  return (
    <>
      <div className={classNames(styles.container, containerClassName)}>
        <ButtonLink
          className={styles.linkWrapper}
          download={name}
          href={src}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FileIcon className={iconContainerClassName} size={size} />
          <div
            className={classNames(styles.fileExtension, {
              [styles.fileExtensionExtraSmall]:
                variant === FilePreviewVariant.extraSmall,
              [styles.fileExtensionSmall]: variant === FilePreviewVariant.small,
              [styles.fileExtensionMedium]:
                variant === FilePreviewVariant.medium,
              [styles.fileExtensionCurrentUser]: isCurrentUser,
            })}
          >
            {extension}
          </div>
          <div className={styles.overlay} />
        </ButtonLink>
      </div>
      {!isPreview && (
        <>
          <p
            className={classNames(styles.fileInfo, {
              [styles.fileInfoCurrentUser]: isCurrentUser,
            })}
          >
            {getFileName(name)}
          </p>
          {fileSize && (
            <p
              className={classNames(styles.fileInfo, {
                [styles.fileInfoCurrentUser]: isCurrentUser,
              })}
            >
              {convertBytes(fileSize)}
            </p>
          )}
        </>
      )}
    </>
  );
}
