import React from "react";
import { useSelector } from "react-redux";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import { LinkPreviewData } from "@/shared/interfaces";
import { TextEditorValue } from "@/shared/ui-kit";
import { selectFilesPreview } from "@/store/states";
import { useLinkPreviewData } from "../../hooks";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
  message: TextEditorValue;
  onLinkPreviewDataChange: (data: LinkPreviewData | null) => void;
}

const MessageLinkPreview: React.FC<MessageLinkPreviewProps> = (props) => {
  const { message, onLinkPreviewDataChange } = props;
  const filesPreview = useSelector(selectFilesPreview());
  const { currentUrl, previewDataState, onPreviewDataReset } =
    useLinkPreviewData({ message, onLinkPreviewDataChange });
  const { loading: isPreviewDataLoading, data: previewData } = previewDataState;

  if (
    (filesPreview && filesPreview.length > 0) ||
    (!isPreviewDataLoading && !previewData)
  ) {
    return null;
  }

  return (
    <div className={styles.container}>
      <a
        className={styles.linkContainer}
        href={previewData?.url || currentUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {previewData && (
          <>
            <img
              className={styles.image}
              src={previewData.image}
              alt={previewData.title}
            />
            <div className={styles.infoContainer}>
              <span className={styles.title} title={previewData.title}>
                {previewData.title}
              </span>
              <span
                className={styles.description}
                title={previewData.description}
              >
                {previewData.description}
              </span>
              <span className={styles.url}>{previewData.url}</span>
            </div>
          </>
        )}
        {isPreviewDataLoading && (
          <div className={styles.loadingContainer}>
            <span className={styles.loadingText}>Loading...</span>
            <span className={styles.url}>{currentUrl}</span>
          </div>
        )}
      </a>
      <ButtonIcon
        className={styles.closeIconWrapper}
        onClick={onPreviewDataReset}
      >
        <Close2Icon />
      </ButtonIcon>
    </div>
  );
};

export default MessageLinkPreview;
