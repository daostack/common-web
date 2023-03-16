import React, { FC } from "react";
import classNames from "classnames";
import { ChatItem } from "@/pages/common/components/ChatComponent";
import { isRTL } from "@/shared/utils";
import styles from "./DesktopChat.module.scss";

interface ChatProps {
  chatItem: ChatItem;
}

const DesktopChat: FC<ChatProps> = (props) => {
  const { chatItem } = props;

  return (
    <div className={styles.container}>
      <div className={styles.titleWrapper}>
        <p
          className={classNames(styles.title, {
            [styles.titleRTL]: isRTL(chatItem.discussion.title),
          })}
          title={chatItem.discussion.title}
        >
          {chatItem.discussion.title}
        </p>
      </div>
    </div>
  );
};

export default DesktopChat;
