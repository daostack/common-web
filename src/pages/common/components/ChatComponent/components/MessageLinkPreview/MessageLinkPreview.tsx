import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ButtonIcon } from "@/shared/components";
import { useLoadingState } from "@/shared/hooks";
import { Close2Icon } from "@/shared/icons";
import { serializeTextEditorValue, TextEditorValue } from "@/shared/ui-kit";
import { extractUrls } from "@/shared/utils";
import { selectFilesPreview } from "@/store/states";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
  message: TextEditorValue;
}

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

const MessageLinkPreview: React.FC<MessageLinkPreviewProps> = (props) => {
  const { message } = props;
  const filesPreview = useSelector(selectFilesPreview());
  const [currentUrl, setCurrentUrl] = useState("");
  const [
    { loading: isPreviewDataLoading, data: previewData },
    setPreviewDataState,
  ] = useLoadingState<PreviewData | null>(null);
  const urls = useMemo(
    () => extractUrls(serializeTextEditorValue(message)),
    [message],
  );

  const clearPreviewData = () => {
    // TODO: clear request
    setPreviewDataState({
      loading: false,
      fetched: false,
      data: null,
    });
    // TODO: clear data in ChatComponent
  };

  useEffect(() => {
    if (urls.length === 0) {
      setCurrentUrl("");
      return;
    }
    if (urls.includes(currentUrl)) {
      return;
    }

    setCurrentUrl(urls[0]);
  }, [urls]);

  useEffect(() => {
    if (!currentUrl) {
      if (previewData) {
        clearPreviewData();
      }

      return;
    }

    (async () => {
      setPreviewDataState({
        loading: true,
        fetched: false,
        data: null,
      });
      await new Promise((res) => setTimeout(res, 2000));
      setPreviewDataState({
        loading: false,
        fetched: true,
        data: {
          title: "David Kushner - Mr. Forgettable [Official Music Video]",
          description:
            "HEADLINE SHOWSOctober 18th - Brooklyn, NY - https://bit.ly/3SkMxSlOctober 21st - Los Angeles, CA - https://bit.ly/3BPd9UCOctober 26th - Chicago, IL - https:/...",
          image: "https://i.ytimg.com/vi/7TCncxWNcPU/maxresdefault.jpg",
          url: "https://youtu.be/7TCncxWNcPU?list=RD7TCncxWNcPU",
        },
      });
    })();
  }, [currentUrl]);

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
        onClick={clearPreviewData}
      >
        <Close2Icon />
      </ButtonIcon>
    </div>
  );
};

export default MessageLinkPreview;
