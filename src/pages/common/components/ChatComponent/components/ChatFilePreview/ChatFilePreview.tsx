import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonIcon } from "@/shared/components/ButtonIcon";
import { MimePrefixes } from "@/shared/constants/mimeTypes";
import { MinusIcon } from "@/shared/icons";
import { FilePreview } from "@/shared/ui-kit";
import { selectFilesPreview, chatActions } from "@/store/states";
import styles from "./ChatFilePreview.module.scss";

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
              <FilePreview src={file.src} name={file.info.name} size={100} />
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
