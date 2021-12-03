import React, { useCallback } from "react";

import { MembershipRequestModal } from "../MembershipRequestModal";
import { useModal } from "../../../../../shared/hooks";
import "./index.scss";
import { Common } from "../../../../../shared/models";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
  common: Common;
}

export default function EmptyTabComponent({ currentTab, message, title, common }: EmptyTabComponentProps) {
  const { isShowing: showJoinModal, onClose: onCloseJoinModal } = useModal(false);

  const closeJoinModalHandler = useCallback(() => {
    onCloseJoinModal();
  }, [onCloseJoinModal]);

  return (
    <>
      <MembershipRequestModal
        isShowing={showJoinModal}
        onClose={closeJoinModalHandler}
        common={common}
      />
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
