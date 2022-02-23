import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import classNames from "classnames";
import {
  Button,
  ButtonVariant,
  Loader,
  NotFound,
  Share,
  UserAvatar,
} from "../../../../shared/components";
import { Modal } from "../../../../shared/components/Modal";
import {
  useAuthorizedModal,
  useModal,
  useOutsideClick,
  useViewPortHook,
} from "../../../../shared/hooks";
import PurpleCheckIcon from "../../../../shared/icons/purpleCheck.icon";
import ShareIcon from "../../../../shared/icons/share.icon";
import {
  Discussion,
  Proposal,
  ProposalState,
  ProposalType,
} from "../../../../shared/models";
import { getScreenSize } from "@/shared/store/selectors";
import { formatPrice, getUserName } from "@/shared/utils";
import {
  AboutTabComponent,
  PreviewInformationList,
  DiscussionsComponent,
  DiscussionDetailModal,
  ProposalsComponent,
  ProposalsHistory,
  AboutSidebarComponent,
  AddDiscussionComponent,
} from "../../components/CommonDetailContainer";
import { MembershipRequestModal } from "../../components/CommonDetailContainer/MembershipRequestModal";
import { ProposalDetailModal } from "../../components/CommonDetailContainer/ProposalDetailModal";
import {
  BASE_URL,
  Colors,
  ROUTE_PATHS,
  ScreenSize,
} from "../../../../shared/constants";
import { MobileLinks } from "../../../../shared/components/MobileLinks";
import {
  selectCommonDetail,
  selectCurrentDisscussion,
  selectCurrentProposal,
  selectDiscussions,
  selectIsDiscussionsLoaded,
  selectIsProposalLoaded,
  selectProposals,
  selectUserPaymentMethod,
} from "../../store/selectors";
import {
  clearCurrentDiscussion,
  clearCurrentProposal,
  closeCurrentCommon,
  getCommonDetail,
  loadCommonDiscussionList,
  loadDisscussionDetail,
  loadProposalDetail,
  loadProposalList,
  createDiscussion,
  createFundingProposal,
  checkUserPaymentMethod,
} from "../../store/actions";
import CheckIcon from "../../../../shared/icons/check.icon";
import { selectUser } from "../../../Auth/store/selectors";
import {
  AddProposalComponent,
  AddProposalSteps,
} from "@/containers/Common/components/CommonDetailContainer/AddProposalComponent";
import { CreateFundingRequestProposalPayload } from "@/shared/interfaces/api/proposal";
import { DeleteCommonPrompt } from "../../components/CommonDetailContainer/DeleteCommonPrompt";
import "./index.scss";

interface CommonDetailRouterParams {
  id: string;
}

const tabs = [
  {
    name: "Agenda",
    key: "about",
  },
  {
    name: "Discussions",
    key: "discussions",
  },
  {
    name: "Proposals",
    key: "proposals",
  },
  {
    name: "History",
    key: "history",
  },
];

export default function CommonDetail() {
  const { id } = useParams<CommonDetailRouterParams>();
  const [joinEffortRef, setJoinEffortRef] = useState<HTMLDivElement | null>(
    null
  );
  const inViewport = useViewPortHook(joinEffortRef, "-50px");
  const inViewPortFooter = useViewPortHook(
    document.querySelector(".footer-wrapper"),
    "0px"
  );
  const [stickyClass, setStickyClass] = useState("");
  const [footerClass, setFooterClass] = useState("");
  const [tab, setTab] = useState("about");
  const [imageError, setImageError] = useState(false);
  const [isCreationStageReached, setIsCreationStageReached] = useState(false);
  const [isCommonFetched, setIsCommonFetched] = useState(false);

  const [showActions, setShowActions] = useState(false);
  const actionsRef = useRef(null);
  const { isOutside, setOusideValue } = useOutsideClick(actionsRef);

  const common = useSelector(selectCommonDetail());
  const currentDisscussion = useSelector(selectCurrentDisscussion());
  const proposals = useSelector(selectProposals());
  const discussions = useSelector(selectDiscussions());
  const isDiscussionsLoaded = useSelector(selectIsDiscussionsLoaded());
  const isProposalsLoaded = useSelector(selectIsProposalLoaded());
  const currentProposal = useSelector(selectCurrentProposal());
  const screenSize = useSelector(getScreenSize());
  const user = useSelector(selectUser());
  const hasPaymentMethod = useSelector(selectUserPaymentMethod());

  useEffect(() => {
    if (isOutside) {
      setShowActions(false);
      setOusideValue();
    }
  }, [isOutside, setShowActions, setOusideValue]);

  const fundingProposals = useMemo(
    () =>
      proposals.filter(
        (proposal) => proposal.type === ProposalType.FundingRequest
      ),
    [proposals]
  );

  const activeProposals = useMemo(
    () => fundingProposals.filter((d) => d.state === ProposalState.COUNTDOWN),
    [fundingProposals]
  );

  const historyProposals = useMemo(
    () => fundingProposals.filter((d) => d.state !== ProposalState.COUNTDOWN),
    [fundingProposals]
  );

  const isCommonMember = Boolean(
    common?.members.some((member) => member.userId === user?.uid)
  );
  const isJoiningPending = proposals.some(
    (proposal) =>
      proposal.state === ProposalState.COUNTDOWN &&
      proposal.proposerId === user?.uid
  );
  const shouldAllowJoiningToCommon =
    !isCommonMember && (isCreationStageReached || !isJoiningPending);
  const shouldShowStickyJoinEffortButton =
    screenSize === ScreenSize.Mobile &&
    ((tab === "discussions" && discussions?.length > 0) ||
      (tab === "proposals" && activeProposals.length > 0) ||
      (tab === "history" && historyProposals.length > 0)) &&
    !isCommonMember &&
    !isJoiningPending &&
    !inViewport &&
    (stickyClass || footerClass);

  const dispatch = useDispatch();

  const { isShowing, onOpen, onClose } = useModal(false);
  const {
    isShowing: isShowingNewD,
    onOpen: onOpenNewD,
    onClose: onCloseNewD,
  } = useModal(false);

  const {
    isShowing: showDeleteCommonPrompt,
    onOpen: onOpenDeteleCommonPrompt,
    onClose: onCloseDeleteCommonPrompt
  } = useModal(false);

  const {
    isShowing: isShowingNewP,
    onOpen: onOpenNewP,
    onClose: onCloseNewP,
  } = useModal(false);

  const {
    isModalOpen: showJoinModal,
    onOpen: onOpenJoinModal,
    onClose: onCloseJoinModal,
  } = useAuthorizedModal();
  const isMobileView = screenSize === ScreenSize.Mobile;

  useEffect(() => {
    dispatch(checkUserPaymentMethod.request());
    dispatch(
      getCommonDetail.request({
        payload: id,
        callback: () => {
          setIsCommonFetched(true);
        },
      })
    );
    return () => {
      dispatch(closeCurrentCommon());
    };
  }, [dispatch, id]);

  const changeTabHandler = useCallback(
    (tab: string) => {
      switch (tab) {
        case "discussions":
          if (!isDiscussionsLoaded) {
            dispatch(loadCommonDiscussionList.request());
          }
          break;
        case "history":
        case "proposals":
          if (!isProposalsLoaded) {
            dispatch(loadProposalList.request());
          }
          break;

        default:
          break;
      }
      setTab(tab);
    },
    [dispatch, isDiscussionsLoaded, isProposalsLoaded]
  );

  const getDisscussionDetail = useCallback(
    (payload: Discussion) => {
      dispatch(loadDisscussionDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  const getProposalDetail = useCallback(
    (payload: Proposal) => {
      dispatch(loadProposalDetail.request(payload));
      onOpen();
    },
    [dispatch, onOpen]
  );

  const closeModalHandler = useCallback(() => {
    onClose();
    dispatch(clearCurrentDiscussion());
    dispatch(clearCurrentProposal());
    dispatch(loadCommonDiscussionList.request());
  }, [onClose, dispatch]);

  const clickPreviewDisscusionHandler = useCallback(
    (id: string) => {
      changeTabHandler("discussions");
      const disscussion = discussions.find((f) => f.id === id);
      if (disscussion) {
        getDisscussionDetail(disscussion);
      }
    },
    [discussions, changeTabHandler, getDisscussionDetail]
  );

  const clickPreviewProposalHandler = useCallback(
    (id: string) => {
      changeTabHandler("proposals");
      const proposal = proposals.find((f) => f.id === id);
      if (proposal) {
        getProposalDetail(proposal);
      }
    },
    [proposals, changeTabHandler, getProposalDetail]
  );

  const addDiscussion = useCallback(
    (payload) => {
      dispatch(
        createDiscussion.request({
          payload: {
            ...payload,
            createTime: new Date(),
            lastMessage: new Date(),
            ownerId: user?.uid,
            commonId: common?.id,
          },
          callback: (discussion: Discussion) => {
            onCloseNewD();
            setTimeout(() => {
              getDisscussionDetail(discussion);
            }, 0);
          },
        })
      );
    },
    [dispatch, user, common, onCloseNewD, getDisscussionDetail]
  );

  const addProposal = useCallback(
    (
      payload: CreateFundingRequestProposalPayload,
      callback: (step: AddProposalSteps) => void
    ) => {
      dispatch(createFundingProposal.request({ payload, callback }));
    },
    [dispatch]
  );

  const openJoinModal = useCallback(() => {
    onClose();
    setTimeout(onOpenJoinModal, 0);
  }, [onOpenJoinModal, onClose]);

  const closeJoinModal = useCallback(() => {
    onCloseJoinModal();
    if (currentDisscussion || currentProposal) {
      setTimeout(onOpen, 0);
    }
  }, [onOpen, currentProposal, currentDisscussion, onCloseJoinModal]);

  const addPost = useCallback(() => {
    if (!user) return setTimeout(onOpenJoinModal, 0);
    onOpenNewD();
  }, [onOpenJoinModal, onOpenNewD, user]);

  const addNewProposal = useCallback(() => {
    if (!user) return setTimeout(onOpenJoinModal, 0);
    onOpenNewP();
  }, [onOpenJoinModal, onOpenNewP, user]);

  const renderSidebarContent = () => {
    if (!common) return null;
    switch (tab) {
      case "about":
        return (
          <>
            <PreviewInformationList
              title="Latest Discussions"
              discussions={discussions}
              vievAllHandler={() => changeTabHandler("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler("proposals")}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
            />
          </>
        );

      case "discussions":
        return (
          <>
            <AboutSidebarComponent
              title="About"
              vievAllHandler={() => changeTabHandler("about")}
              common={common}
            />
            <PreviewInformationList
              title="Latest Proposals"
              proposals={activeProposals}
              vievAllHandler={() => changeTabHandler("proposals")}
              onClickItem={clickPreviewProposalHandler}
              type="proposals"
            />
          </>
        );
      case "proposals":
        return (
          <>
            <AboutSidebarComponent
              title="About"
              vievAllHandler={() => changeTabHandler("about")}
              common={common}
            />
            <PreviewInformationList
              title="Latest Discussions"
              discussions={discussions}
              vievAllHandler={() => changeTabHandler("discussions")}
              onClickItem={clickPreviewDisscusionHandler}
              type="discussions"
            />
          </>
        );
      case "history":
        return (
          <ProposalsHistory proposals={historyProposals} common={common} />
        );
    }
  };

  useEffect(() => {
    if (inViewport) {
      setStickyClass("");
    } else {
      if (joinEffortRef && joinEffortRef.offsetTop < window.scrollY) {
        if (tab === "discussions" && discussions?.length) {
          setStickyClass("sticky");
        } else if (tab === "proposals" && activeProposals.length) {
          setStickyClass("sticky");
        } else if (tab === "history" || tab === "about") {
          setStickyClass("sticky");
        }
      }
    }
  }, [
    inViewport,
    activeProposals,
    tab,
    discussions,
    setStickyClass,
    joinEffortRef,
  ]);

  useEffect(() => {
    if (inViewPortFooter) {
      if (inViewport) {
        setStickyClass("sticky");
      }
      setFooterClass("footer-sticky");
    } else {
      setFooterClass("");
    }
  }, [inViewPortFooter, setFooterClass, inViewport]);

  useEffect(() => {
    if (showJoinModal && !shouldAllowJoiningToCommon) {
      closeJoinModal();
    }
  }, [showJoinModal, shouldAllowJoiningToCommon, closeJoinModal]);

  if (!common) {
    return isCommonFetched ? <NotFound /> : <Loader />;
  }

  const sharingURL = `${BASE_URL}${ROUTE_PATHS.COMMON_LIST}/${common.id}`;

  return (
    <>
      {isShowing && (
        <Modal
          isShowing={isShowing}
          onClose={closeModalHandler}
          closeColor={
            screenSize === ScreenSize.Mobile ? Colors.white : Colors.gray
          }
          className={classNames(tab, {
            "common-detail-container__detail-modal--mobile": isMobileView,
          })}
          isHeaderSticky
          shouldShowHeaderShadow={false}
          styles={{
            headerWrapper:
              "common-detail-container__detail-modal-header-wrapper",
            header: "common-detail-container__detail-modal-header",
            closeWrapper: "common-detail-container__detail-modal-close-wrapper",
            content: "common-detail-container__detail-modal-content",
          }}
        >
          {!isMobileView && tab === "discussions" && (
            <DiscussionDetailModal
              disscussion={currentDisscussion}
              commonId={common.id}
              onOpenJoinModal={openJoinModal}
              isCommonMember={isCommonMember}
              isJoiningPending={isJoiningPending}
            />
          )}
          {!isMobileView && (tab === "proposals" || tab === "history") && (
            <ProposalDetailModal
              proposal={currentProposal}
              commonId={common.id}
              onOpenJoinModal={openJoinModal}
              isCommonMember={isCommonMember}
              isJoiningPending={isJoiningPending}
            />
          )}
          {isMobileView && (
            <div className="get-common-app-wrapper">
              <img
                src="/icons/logo-all-white.svg"
                alt="logo"
                className="logo"
              />
              <span className="text">
                Download the Common app to participate in discussions and join
                the community
              </span>
              <MobileLinks color={Colors.black} detectOS={true} />
            </div>
          )}
        </Modal>
      )}
      {showJoinModal && (
        <MembershipRequestModal
          isShowing={showJoinModal}
          onClose={closeJoinModal}
          common={common}
          onCreationStageReach={setIsCreationStageReached}
        />
      )}
      {isShowingNewD && (
        <AddDiscussionComponent
          isShowing={isShowingNewD}
          onClose={onCloseNewD}
          onDiscussionAdd={addDiscussion}
        />
      )}
      {isShowingNewP && (
        <AddProposalComponent
          isShowing={isShowingNewP}
          onClose={onCloseNewP}
          onProposalAdd={addProposal}
          common={common}
          hasPaymentMethod={hasPaymentMethod}
          proposals={proposals}
          getProposalDetail={getProposalDetail}
        />
      )}
      {showDeleteCommonPrompt && (
        <DeleteCommonPrompt
          isShowing={showDeleteCommonPrompt}
          onClose={onCloseDeleteCommonPrompt}
          commonId={common.id} />
      )}
      <div className="common-detail-wrapper">
        <div className="main-information-block">
          <div className="main-information-wrapper">
            <div className="content-element img-wrapper">
              {!imageError ? (
                <img
                  src={common?.image}
                  alt={common?.name}
                  onError={() => setImageError(true)}
                />
              ) : (
                <img
                  className="default-image"
                  src="/icons/logo-white.svg"
                  alt={common.name}
                />
              )}
            </div>
            <div className="content-element text-information-wrapper">
              <div className="text">
                <div className="text-information-wrapper__info-wrapper">
                  <div className="name">
                    {common?.name}
                    {isMobileView && !isCommonMember && (
                      <Share
                        url={sharingURL}
                        type="modal"
                        color={Colors.transparent}
                      />
                    )}
                    {isMobileView && isCommonMember && (
                      <div className="text-information-wrapper__connected-user-avatar-wrapper">
                        <UserAvatar
                          className="text-information-wrapper__user-avatar"
                          photoURL={user?.photoURL}
                          nameForRandomAvatar={user?.email}
                          userName={getUserName(user)}
                        />
                        <PurpleCheckIcon className="text-information-wrapper__connected-user-avatar-icon" />
                      </div>
                    )}
                  </div>
                  <div className="tagline">{common?.metadata.byline}</div>
                </div>
              </div>
              <div className="numbers">
                <div className="item">
                  <div className="value">{formatPrice(common?.balance)}</div>
                  <div className="name">{`Available ${screenSize === ScreenSize.Desktop ? "Funds" : ""
                    }`}</div>
                  {Boolean(common.reservedBalance) && (
                    <div className="text-information-wrapper__secondary-text">
                      In process: {formatPrice(common.reservedBalance)}
                    </div>
                  )}
                </div>
                <div className="item">
                  <div className="value">{formatPrice(common?.raised)}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Total" : ""
                    } Raised`}</div>
                </div>
                <div className="item">
                  <div className="value">{common?.members.length}</div>
                  <div className="name">Members</div>
                </div>
                <div className="item">
                  <div className="value">{activeProposals.length}</div>
                  <div className="name">{`${screenSize === ScreenSize.Desktop ? "Active" : ""
                    } Proposals`}</div>
                </div>
              </div>
            </div>
            <div className="common-content-selector">
              <div className="content-element tabs-container">
                <div className="tabs-wrapper">
                  {tabs.map((t) => (
                    <div
                      key={t.key}
                      className={`tab-item ${tab === t.key ? "active" : ""}`}
                      onClick={() => changeTabHandler(t.key)}
                    >
                      {t.name}
                    </div>
                  ))}
                </div>
                <div className="social-wrapper" ref={setJoinEffortRef}>
                  <div className="common-actions-wrapper" ref={actionsRef}>
                    <button
                      className={`add-action ${showActions ? "opened" : ""}`}
                      onClick={() => setShowActions((v) => !v)}
                    >
                      <img src="/icons/common-action.svg" alt="common-action" />
                      Add
                    </button>

                    {showActions && (
                      <div className="common-actions">
                        <div className="add-button" onClick={onOpenNewD}>
                          <img src="/icons/add-discussion.svg" alt="add-post" />
                          Add New Post
                        </div>
                        {isCommonMember && (
                          <div className="add-button" onClick={onOpenNewP}>
                            <img src="/icons/add-proposal.svg" alt="add-post" />
                            Add New Proposal
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {!isCommonMember && (
                    <button
                      className={`button-blue join-the-effort-btn`}
                      onClick={onOpenJoinModal}
                      disabled={isJoiningPending}
                    >
                      {isJoiningPending
                        ? "Pending approval"
                        : "Join the effort"}
                    </button>
                  )}

                  {isCommonMember && screenSize === ScreenSize.Desktop && (
                    <div className="member-label">
                      <CheckIcon className="member-label__icon" />
                      You are a member
                    </div>
                  )}

                  {isCommonMember && common.members.length === 1 && (
                    <Button
                      variant={ButtonVariant.Secondary}
                      className="delete-common-btn"
                      onClick={onOpenDeteleCommonPrompt}>
                      Delete this Common
                    </Button>
                  )}

                  {screenSize === ScreenSize.Desktop && (
                    <Share
                      url={sharingURL}
                      type="popup"
                      color={Colors.lightPurple}
                    />
                  )}
                </div>
                {isCommonMember && isMobileView && (
                  <Share
                    url={sharingURL}
                    type="modal"
                    color={Colors.transparent}
                  >
                    <button className="button-blue common-content-selector__long-share-button">
                      <ShareIcon className="common-content-selector__share-icon" />
                      Share Common
                    </button>
                  </Share>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="main-content-container">
          <div
            className={
              tab === "history"
                ? "content-element inner-main-content-wrapper history"
                : "content-element inner-main-content-wrapper"
            }
          >
            <div className="tab-content-wrapper">
              {tab === "about" && (
                <>
                  <div className="about-title">About</div>
                  <AboutTabComponent
                    common={common}
                    screenSize={screenSize}
                    onOpenJoinModal={onOpenJoinModal}
                    isCommonMember={isCommonMember}
                    isJoiningPending={isJoiningPending}
                  />
                </>
              )}
              {tab === "discussions" && (
                <DiscussionsComponent
                  onAddNewPost={addPost}
                  common={common}
                  discussions={discussions || []}
                  loadDisscussionDetail={getDisscussionDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}

              {tab === "proposals" && (
                <ProposalsComponent
                  onAddNewProposal={addNewProposal}
                  common={common}
                  currentTab={tab}
                  proposals={activeProposals}
                  loadProposalDetail={getProposalDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}

              {tab === "history" && (
                <ProposalsComponent
                  onAddNewProposal={addNewProposal}
                  common={common}
                  currentTab={tab}
                  proposals={historyProposals}
                  loadProposalDetail={getProposalDetail}
                  isCommonMember={isCommonMember}
                  isJoiningPending={isJoiningPending}
                />
              )}
            </div>
            {shouldShowStickyJoinEffortButton && (
              <button
                className={`button-blue join-the-effort-btn ${stickyClass} ${footerClass}`}
                onClick={onOpenJoinModal}
              >
                Join the effort
              </button>
            )}
            {(screenSize === ScreenSize.Desktop || tab !== "about") && (
              <div className="sidebar-wrapper">{renderSidebarContent()}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
