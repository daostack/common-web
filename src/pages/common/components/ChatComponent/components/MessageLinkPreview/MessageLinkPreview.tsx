import React, { useMemo } from "react";
import { LinkPreview } from "@/shared/components";
import { TextEditorValue, serializeTextEditorValue } from "@/shared/ui-kit";
import { extractUrls } from "@/shared/utils";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
  message: TextEditorValue;
}

const MessageLinkPreview: React.FC<MessageLinkPreviewProps> = ({ message }) => {
  const urls = useMemo(
    () => extractUrls(serializeTextEditorValue(message)),
    [message],
  );

  return (
    <div className={styles.previewLinksContainer}>
      {urls.map((url) => (
        <LinkPreview url={url} />
      ))}
    </div>
  );
};

export default MessageLinkPreview;
