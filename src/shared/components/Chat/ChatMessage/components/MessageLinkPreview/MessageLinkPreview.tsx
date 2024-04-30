import React, { FC, useMemo } from "react";
import classNames from "classnames";
import styles from "./MessageLinkPreview.module.scss";

interface MessageLinkPreviewProps {
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
  const { isOtherPersonMessage } = props;
  const data = {
    title: "David Kushner - Mr. Forgettable [Official Music Video]",
    description:
      "HEADLINE SHOWSOctober 18th - Brooklyn, NY - https://bit.ly/3SkMxSlOctober 21st - Los Angeles, CA - https://bit.ly/3BPd9UCOctober 26th - Chicago, IL - https:/...",
    image: "https://i.ytimg.com/vi/7TCncxWNcPU/maxresdefault.jpg",
    url: "https://youtu.be/7TCncxWNcPU?list=RD7TCncxWNcPU",
  };
  const urlOrigin = useMemo(() => getUrlOrigin(data.url), [data.url]);

  return (
    <a
      className={classNames(styles.container, {
        [styles.containerOtherPerson]: isOtherPersonMessage,
      })}
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <img className={styles.image} src={data.image} alt={data.title} />
      <div className={styles.contentWrapper}>
        <span className={styles.title} title={data.title}>
          {data.title}
        </span>
        <span className={styles.description} title={data.description}>
          {data.description}
        </span>
        <span className={styles.url}>{urlOrigin}</span>
      </div>
    </a>
  );
};

export default MessageLinkPreview;
