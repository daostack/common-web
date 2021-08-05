import React, { useCallback } from "react";

import { MembershipRequestModal } from "../MembershipRequestModal";
import { Modal } from "../../../../../shared/components/Modal";
import { useModal } from "../../../../../shared/hooks";
import "./index.scss";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
}

export default function EmptyTabComponent({ currentTab, message, title }: EmptyTabComponentProps) {
  const { isShowing: showJoinModal, onClose: onCloseJoinModal } = useModal(false);

  const closeJoinModalHandler = useCallback(() => {
    onCloseJoinModal();
  }, [onCloseJoinModal]);

  return (
    <>
      <Modal isShowing={showJoinModal} onClose={closeJoinModalHandler} className="mobile-full-screen" mobileFullScreen>
        <MembershipRequestModal closeModal={closeJoinModalHandler} />
      </Modal>
      <div className="empty-tab-component-wrapper">
        <div className="img-wrapper">
          {currentTab === "proposals" && <img alt={currentTab} src="/icons/proposals-empty.svg" />}
          {currentTab === "history" && <img alt={currentTab} src="/icons/proposals-empty.svg" />}
          {currentTab === "discussions" && <img alt={currentTab} src="/icons/discussions-empty.svg" />}
        </div>
        <div className="empty-tab-content-wrapper ">
          <div className="title">{title}</div>
          <div className="message">{message}</div>
        </div>
      </div>
    </>
  );
}
