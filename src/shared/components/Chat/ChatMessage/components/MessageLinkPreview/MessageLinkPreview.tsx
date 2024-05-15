import React, { FC, useMemo } from "react";
import classNames from "classnames";
import { Image } from "@/shared/components";
import { LinkPreview } from "@/shared/models";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
  linkPreview: LinkPreview;
  isOtherPersonMessage: boolean;
}

const getUrlOrigin = (url: string): string => {
  try {
    return new URL(url).host;
  } catch (err) {
    return "";
  }
};

const MessageLinkPreview: FC<MessageLinkPreviewProps> = (props) => {
  const { linkPreview, isOtherPersonMessage } = props;
  const urlOrigin = useMemo(
    () => getUrlOrigin(linkPreview.url),
    [linkPreview.url],
  );

  return (
    <a
      className={classNames(styles.container, {
        [styles.containerOtherPerson]: isOtherPersonMessage,
      })}
      href={linkPreview?.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      {linkPreview.image && (
        <Image
          className={styles.image}
          src={linkPreview.image.url}
          alt={linkPreview.image.alt || linkPreview.title || ""}
          placeholderElement={null}
        />
      )}
      <div className={styles.contentWrapper}>
        {linkPreview.title && (
          <span className={styles.title} title={linkPreview.title}>
            {linkPreview.title}
          </span>
        )}
        {linkPreview.description && (
          <span className={styles.description} title={linkPreview.description}>
            {linkPreview.description}
          </span>
        )}
        <span className={styles.url}>{urlOrigin}</span>
      </div>
    </a>
  );
};

export default MessageLinkPreview;
