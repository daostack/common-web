import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthorizedModal } from "@/shared/hooks";
import { Common, Governance } from "@/shared/models";
import { ROUTE_PATHS } from "@/shared/constants";
import { LoginModalType } from "@/containers/Auth/interface";
import { Tabs } from "@/containers/Common/containers/CommonDetailContainer";
import "./index.scss";
import { MembershipRequestModal } from "../MembershipRequestModal";

interface EmptyTabComponentProps {
  currentTab: string;
  message: string;
  title: string;
  common?: Common;
  governance?: Governance;
  isCommonMember?: boolean;
  isCommonMemberFetched?: boolean;
  isJoiningPending?: boolean;
}

export default function EmptyTabComponent({
  currentTab,
  message,
  title,
  common,
  governance,
  isCommonMember,
  isCommonMemberFetched = false,
  isJoiningPending,
}: EmptyTabComponentProps) {
  const [isCreationStageReached, setIsCreationStageReached] = useState(false);
  const {
    isModalOpen: isJoinModalOpen,
    onOpen: onJoinModalOpen,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const showJoinModal = isJoinModalOpen && isCommonMemberFetched;
  const isSubCommon = Boolean(common?.directParent);
  const shouldShowJoinToCommonButton =
    Boolean(common) && !isCommonMember && !isJoiningPending && !isSubCommon;
  const shouldAllowJoiningToCommon =
    Boolean(common) &&
    !isCommonMember &&
    !isSubCommon &&
    (isCreationStageReached || !isJoiningPending);

  const handleModalOpen = useCallback(() => {
    onJoinModalOpen(LoginModalType.RequestToJoin);
  }, [onJoinModalOpen]);

  useEffect(() => {
    if (showJoinModal && !shouldAllowJoiningToCommon) {
      onCloseJoinModal();
    }
  }, [showJoinModal, shouldAllowJoiningToCommon, onCloseJoinModal]);

  return (
    <>
      {common && governance && (
        <MembershipRequestModal
          isShowing={showJoinModal}
          onClose={onCloseJoinModal}
          common={common}
          governance={governance}
          onCreationStageReach={setIsCreationStageReached}
        />
      )}
      <div className={`empty-tab-component-wrapper `}>
        <div className="img-wrapper">
          {currentTab === Tabs.Proposals && (
            <img alt={currentTab} src="/icons/proposals-empty.svg" />
          )}

          {currentTab === Tabs.Discussions && (
            <img alt={currentTab} src="/icons/discussions-empty.svg" />
          )}
          {currentTab === "my-commons" && (
            <img alt={currentTab} src="/assets/images/human-pyramid.svg" />
          )}
          {currentTab === "messages" && (
            <img
              alt={currentTab}
              src="/assets/images/illustrations-full-page-common.svg"
            />
          )}
        </div>
        <div className="empty-tab-content-wrapper ">
          <div className="title">{title}</div>
          <div className="message">{message}</div>

          <div className="empty-tab-content-wrapper__buttons-wrapper">
            {shouldShowJoinToCommonButton && (
              <button
                className="button-blue empty-tab-content-wrapper__button"
                onClick={handleModalOpen}
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
