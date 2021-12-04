import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { MembershipRequestModal } from "../MembershipRequestModal";
import { useModal } from "../../../../../shared/hooks";
import "./index.scss";
import { Common } from "../../../../../shared/models";
import { ROUTE_PATHS } from "../../../../../shared/constants";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
  common?: Common;
}

export default function EmptyTabComponent({
  currentTab,
  message,
  title,
  common,
}: EmptyTabComponentProps) {
  const { isShowing: showJoinModal, onClose: onCloseJoinModal } = useModal(
    false
  );

  const closeJoinModalHandler = useCallback(() => {
    onCloseJoinModal();
  }, [onCloseJoinModal]);

  return (
    <>
      {common && (
        <MembershipRequestModal
          isShowing={showJoinModal}
          onClose={closeJoinModalHandler}
          common={common}
        />
      )}
      <div className="empty-tab-component-wrapper">
        <div className="img-wrapper">
          {currentTab === "proposals" && (
            <img alt={currentTab} src="/icons/proposals-empty.svg" />
          )}
          {currentTab === "history" && (
            <img alt={currentTab} src="/icons/proposals-empty.svg" />
          )}
          {currentTab === "discussions" && (
            <img alt={currentTab} src="/icons/discussions-empty.svg" />
          )}
          {currentTab === "my-commons" && (
            <img
              alt={currentTab}
              src="/assets/images/membership-request-membership.svg"
            />
          )}
        </div>
        <div className="empty-tab-content-wrapper ">
          <div className="title">{title}</div>
          <div className="message">{message}</div>

          {currentTab === "my-commons" && (
            <Link to={`${ROUTE_PATHS.COMMON_LIST}`}>
              <button className={`button-blue`}>Browse all Commons</button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
