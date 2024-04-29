import React, { useMemo } from "react";
import { ButtonIcon } from "@/shared/components";
import { Close2Icon } from "@/shared/icons";
import { TextEditorValue, serializeTextEditorValue } from "@/shared/ui-kit";
import { emptyFunction, extractUrls } from "@/shared/utils";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
  message: TextEditorValue;
}

const MessageLinkPreview: React.FC<MessageLinkPreviewProps> = ({ message }) => {
  const urls = useMemo(
    () => extractUrls(serializeTextEditorValue(message)),
    [message],
  );
  const data = {
    title: "David Kushner - Mr. Forgettable [Official Music Video]",
    description:
      "HEADLINE SHOWSOctober 18th - Brooklyn, NY - https://bit.ly/3SkMxSlOctober 21st - Los Angeles, CA - https://bit.ly/3BPd9UCOctober 26th - Chicago, IL - https:/...",
    image: "https://i.ytimg.com/vi/7TCncxWNcPU/maxresdefault.jpg",
    url: "https://youtu.be/7TCncxWNcPU?list=RD7TCncxWNcPU",
  };

  return (
    <div className={styles.container}>
      <a
        className={styles.linkContainer}
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img className={styles.image} src={data.image} alt={data.title} />
        <div className={styles.infoContainer}>
          <span className={styles.title} title={data.title}>
            {data.title}
          </span>
          <span className={styles.description} title={data.description}>
            {data.description}
          </span>
          <span className={styles.url}>{data.url}</span>
        </div>
      </a>
      <ButtonIcon className={styles.closeIconWrapper} onClick={emptyFunction}>
        <Close2Icon />
      </ButtonIcon>
    </div>
  );
};

export default MessageLinkPreview;
