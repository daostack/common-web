import React, { FC, useState } from "react";
import { Modal } from "@/shared/components";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { ChatChannel, User } from "@/shared/models";
import { MobileChat } from "../MobileChat";
import { ProfileContent } from "../ProfileContent";
import styles from "./MobileProfile.module.scss";

interface MobileProfileProps {
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
  onDMClick?: () => void;
  onClose: () => void;
  onChatChannelCreate: (chatChannel: ChatChannel, dmUser: User) => void;
  onUserClick: (userId: string) => void;
}

const MobileProfile: FC<MobileProfileProps> = (props) => {
  const {
    userId,
    commonId,
    chatChannel,
    onDMClick,
    onClose,
    onChatChannelCreate,
    onUserClick,
  } = props;
  const [isChatChannelLoading, setIsChatChannelLoading] = useState(false);
  const isProfileModalOpen = !chatChannel;

  if (chatChannel) {
    return (
      <MobileChat
        chatItem={{
          feedItemId: chatChannel.id,
          chatChannel: chatChannel,
          discussion:
            ChatChannelToDiscussionConverter.toTargetEntity(chatChannel),
        }}
        commonId={""}
        commonName={""}
        commonImage={""}
        commonMember={null}
        shouldShowSeeMore={false}
        onClose={onClose}
        onUserClick={onUserClick}
      />
    );
  }

  return (
    <Modal
      className={styles.modal}
      isShowing={isProfileModalOpen}
      onClose={onClose}
      hideCloseButton={isChatChannelLoading}
      mobileFullScreen
    >
      <ProfileContent
        className={styles.content}
        userId={userId}
        commonId={commonId}
        onDMClick={onDMClick}
        onChatChannelCreate={onChatChannelCreate}
        onChatChannelLoading={setIsChatChannelLoading}
      />
    </Modal>
  );
};

export default MobileProfile;
