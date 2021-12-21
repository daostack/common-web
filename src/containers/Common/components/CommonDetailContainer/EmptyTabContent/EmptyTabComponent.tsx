import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MembershipRequestModal } from "../MembershipRequestModal";
import { selectUser } from "../../../../Auth/store/selectors";
import { useAuthorizedModal } from "../../../../../shared/hooks";
import { Common, Member } from "../../../../../shared/models";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import "./index.scss";

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
  const {
    isModalOpen: showJoinModal,
    onOpen: onJoinModalOpen,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const user = useSelector(selectUser());
  const shouldShowJoinEffortButton =
    common &&
    !common.members.some((member: Member) => member.userId === user?.uid);

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
            {shouldShowJoinEffortButton && (
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
