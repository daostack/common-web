import React, { FC, useState } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { Close2Icon } from "@/shared/icons";
import { ChatChannel } from "@/shared/models";
import { DesktopChat } from "../DesktopChat";
import { DesktopRightPane } from "../DesktopRightPane";
import { ProfileContent } from "../ProfileContent";
import styles from "./DesktopProfile.module.scss";

interface DesktopProfileProps {
  className?: string;
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
  withTitle?: boolean;
  onClose: () => void;
  onChatChannelCreate: (chatChannel: ChatChannel) => void;
  onUserClick: (userId: string) => void;
}

const DesktopProfile: FC<DesktopProfileProps> = (props) => {
  const {
    className,
    userId,
    commonId,
    chatChannel,
    withTitle,
    onClose,
    onChatChannelCreate,
    onUserClick,
  } = props;
  const [isChatChannelLoading, setIsChatChannelLoading] = useState(false);

  if (chatChannel) {
    return (
      <DesktopChat
        className={className}
        chatItem={{
          feedItemId: chatChannel.id,
          chatChannel: chatChannel,
          discussion:
            ChatChannelToDiscussionConverter.toTargetEntity(chatChannel),
          circleVisibility: [],
        }}
        commonId={""}
        commonMember={null}
        withTitle={withTitle}
        onUserClick={onUserClick}
      />
    );
  }

  return (
    <DesktopRightPane className={classNames(styles.container, className)}>
      {!isChatChannelLoading && (
        <ButtonIcon className={styles.closeButton} onClick={onClose}>
          <Close2Icon />
        </ButtonIcon>
      )}
      <div className={styles.contentWrapper}>
        <ProfileContent
          className={styles.content}
          userId={userId}
          commonId={commonId}
          onChatChannelCreate={onChatChannelCreate}
          onChatChannelLoading={setIsChatChannelLoading}
        />
      </div>
    </DesktopRightPane>
  );
};

export default DesktopProfile;
