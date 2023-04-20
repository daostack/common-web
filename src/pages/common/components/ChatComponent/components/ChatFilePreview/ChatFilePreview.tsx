import React from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { useDispatch, useSelector } from "react-redux";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MimePrefixes } from "@/shared/constants/mimeTypes";
import { MinusIcon } from "@/shared/icons";
import { selectFilesPreview, chatActions } from "@/store/states";
import styles from "./ChatFilePreview.module.scss";

const PAGE_SIZE = 100;

export default function ChatFilePreview() {
  const dispatch = useDispatch();
  const filesPreview = useSelector(selectFilesPreview());

  if (!filesPreview || !filesPreview?.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {filesPreview.map((file, index) => (
          <div
            key={`${file.info.name} ${index}`}
            className={styles.filePreviewWrapper}
          >
            {file.info.type.startsWith(MimePrefixes.image) ? (
              <img className={styles.filePreview} src={file.src} />
            ) : (
              <Document className={styles.filePreview} file={file.src}>
                <Page width={PAGE_SIZE} height={PAGE_SIZE} pageNumber={1} />
              </Document>
            )}
            <ButtonIcon
              className={styles.closeButton}
              onClick={() => {
                const updatedArray = [...filesPreview];
                updatedArray.splice(index, 1);
                dispatch(chatActions.setFilesPreview(updatedArray));
              }}
            >
              <MinusIcon />
            </ButtonIcon>
          </div>
        ))}
      </div>
    </div>
  );
}
