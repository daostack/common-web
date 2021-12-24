import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MembershipRequestModal } from "../MembershipRequestModal";
import { useAuthorizedModal } from "../../../../../shared/hooks";
import { Common, Member } from "../../../../../shared/models";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import "./index.scss";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
  common?: Common;
  isCommonMember?: boolean;
  isJoiningPending?: boolean;
}

export default function EmptyTabComponent({
  currentTab,
  message,
  title,
  common,
  isCommonMember,
  isJoiningPending,
}: EmptyTabComponentProps) {
  const {
    isModalOpen: showJoinModal,
    onOpen: onJoinModalOpen,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const shouldAllowJoiningToCommon = Boolean(common) && !isCommonMember && !isJoiningPending;

  useEffect(() => {
    if (showJoinModal && !shouldAllowJoiningToCommon) {
      onCloseJoinModal();
    }
  }, [showJoinModal, shouldAllowJoiningToCommon, onCloseJoinModal]);

  return (
    <>
      {common && (
        <MembershipRequestModal
          isShowing={showJoinModal}
          onClose={onCloseJoinModal}
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

          <div className="empty-tab-content-wrapper__buttons-wrapper">
            {shouldAllowJoiningToCommon && (
              <button
                className="button-blue empty-tab-content-wrapper__button"
                onClick={onJoinModalOpen}
              >
                Join the effort
              </button>
            )}
            {currentTab === "my-commons" && (
              <Link
                className="empty-tab-content-wrapper__button"
                to={`${ROUTE_PATHS.COMMON_LIST}`}
              >
                <button className={`button-blue`}>Browse all Commons</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
