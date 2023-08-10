import React, { FC, useState } from "react";
import { Modal } from "@/shared/components";
import { ChatChannelToDiscussionConverter } from "@/shared/converters";
import { ChatChannel } from "@/shared/models";
import { MobileChat } from "../MobileChat";
import { ProfileContent } from "../ProfileContent";
import styles from "./MobileProfile.module.scss";

interface MobileProfileProps {
  userId: string;
  commonId?: string;
  chatChannel?: ChatChannel;
  onClose: () => void;
  onChatChannelCreate: (chatChannel: ChatChannel) => void;
}

const MobileProfile: FC<MobileProfileProps> = (props) => {
  const { userId, commonId, chatChannel, onClose, onChatChannelCreate } = props;
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
          circleVisibility: [],
        }}
        commonId={""}
        commonName={""}
        commonImage={""}
        commonMember={null}
        shouldShowSeeMore={false}
        onClose={onClose}
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
        onChatChannelCreate={onChatChannelCreate}
        onChatChannelLoading={setIsChatChannelLoading}
      />
    </Modal>
  );
};

export default MobileProfile;
