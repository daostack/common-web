import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MembershipRequestModal } from "../MembershipRequestModal";
import { useModal } from "../../../../../shared/hooks";
import "./index.scss";
import { Common } from "../../../../../shared/models";
import { ROUTE_PATHS } from "../../../../../shared/constants";
import { setIsLoginModalShowing } from "../../../../Auth/store/actions";
import {
  selectUser,
  selectIsLoginModalShowing,
} from "../../../../Auth/store/selectors";

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
  const dispatch = useDispatch();
  const [
    shouldOpenJoinModalOnLoginClose,
    setShouldOpenJoinModalOnLoginClose,
  ] = useState(false);
  const {
    isShowing: showJoinModal,
    onOpen: onJoinModalOpen,
    onClose: onCloseJoinModal,
  } = useModal(false);
  const user = useSelector(selectUser());
  const isLoginModalShowing = useSelector(selectIsLoginModalShowing());

  const handleJoinModalOpen = useCallback(() => {
    if (user) {
      onJoinModalOpen();
      return;
    }

    dispatch(setIsLoginModalShowing(true));
    setShouldOpenJoinModalOnLoginClose(true);
  }, [user, onJoinModalOpen, dispatch]);

  const closeJoinModalHandler = useCallback(() => {
    onCloseJoinModal();
  }, [onCloseJoinModal]);

  useEffect(() => {
    if (shouldOpenJoinModalOnLoginClose && !isLoginModalShowing) {
      setShouldOpenJoinModalOnLoginClose(false);
      onJoinModalOpen();
    }
  }, [shouldOpenJoinModalOnLoginClose, isLoginModalShowing, onJoinModalOpen]);

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

          <div className="empty-tab-content-wrapper__buttons-wrapper">
            <button className="button-blue" onClick={handleJoinModalOpen}>
              Join the effort
            </button>
            {currentTab === "my-commons" && (
              <Link
                className="empty-tab-content-wrapper__browse-commons-button"
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
