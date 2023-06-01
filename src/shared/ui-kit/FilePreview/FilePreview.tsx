import React, { useMemo } from "react";
import classNames from "classnames";
import { ButtonLink } from "@/shared/components";
import { FileIcon } from "@/shared/icons";
import styles from "./FilePreview.module.scss";

export enum FilePreviewVariant {
  small = "small",
  medium = "medium",
}

interface FilePreviewProps {
  name: string;
  src: string;
  size: number;
  variant?: FilePreviewVariant;
  iconContainerClassName?: string;
}

export default function FilePreview(props: FilePreviewProps) {
  const {
    name,
    src,
    size,
    variant = FilePreviewVariant.small,
    iconContainerClassName,
  } = props;

  const extension = useMemo(() => name.split(".")[1], [name]);

  return (
    <div className={styles.container}>
      <ButtonLink
        className={styles.linkWrapper}
        download={name}
        href={src}
        target="_blank"
        rel="noopener noreferrer"
      >
        <FileIcon
          className={classNames(styles.iconContainer, iconContainerClassName)}
          size={size}
        />
      </ButtonLink>
      <div
        className={classNames(styles.fileExtension, {
          [styles.fileExtensionSmall]: variant === FilePreviewVariant.small,
          [styles.fileExtensionMedium]: variant === FilePreviewVariant.medium,
        })}
      >
        {extension}
      </div>
      <div className={styles.overlay} />
    </div>
  );
}
