import React, { FC } from "react";
import classNames from "classnames";
import { ButtonIcon } from "@/shared/components";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { Close2Icon } from "@/shared/icons";
import { ChatChannel } from "@/shared/models";
import { DesktopChat } from "../DesktopChat";
import { DesktopRightPane } from "../DesktopRightPane";
import { ProfileContent } from "../ProfileContent";
import styles from "./ProfilePane.module.scss";

interface ProfilePaneProps {
  className?: string;
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
  withTitle?: boolean;
  onClose: () => void;
  onChatChannelCreate: (chatChannel: ChatChannel) => void;
}

const ProfilePane: FC<ProfilePaneProps> = (props) => {
  const {
    className,
    userId,
    commonId,
    chatChannel,
    withTitle,
    onClose,
    onChatChannelCreate,
  } = props;

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
      />
    );
  }

  return (
    <DesktopRightPane className={classNames(styles.container, className)}>
      <ButtonIcon className={styles.closeButton} onClick={onClose}>
        <Close2Icon />
      </ButtonIcon>
      <div className={styles.contentWrapper}>
        <ProfileContent
          className={styles.content}
          userId={userId}
          commonId={commonId}
          onChatChannelCreate={onChatChannelCreate}
        />
      </div>
    </DesktopRightPane>
  );
};

export default ProfilePane;
